const bcrypt = require('bcrypt');
const { pool } = require('../config/db');
const transporter = require('../config/mailer'); 
const generateOTP = require('../utils/generateOTP')
const session = require("express-session");
const jwtToken = require('jsonwebtoken');

exports.signup = async (req, res) => {
    console.log(req.body)
  const { fullName, email, phoneNumber, password } = req.body;
  if (!fullName || !email || !phoneNumber || !password) {
    console.log("Error because input invalid")
    return res.status(400).json({ error: 'Please provide fullName, email, and password' });
  }

  try {
    const existingEmail = await pool.query('SELECT * FROM userData WHERE email = $1', [email]);
    if (existingEmail.rows.length > 0) {
      console.log("Error because email already exists")
      return res.status(401).json({ error: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO userData (fullName, email, phoneNumber, password)
      VALUES ($1, $2, $3, $4)
      RETURNING id, fullName, phoneNumber, email
    `;
    const values = [fullName, email, phoneNumber, hashedPassword];

    console.log('Running query:', query);
    console.log('With values:', values);

    const result = await pool.query(query, values);
    console.log(result.rows)
    res.status(201).json({ message: 'User created', user: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.login = async (req, res) => {
    console.log(req.body)
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide email and password' });
  }

  try {
    const result = await pool.query('SELECT * FROM userdata WHERE email = $1', [email]);
    console.log(result)
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwtToken.sign(
      { id: user.id, email: user.email, name: user.fullname },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('User logged in:', user.email, user.id, user.fullname);

    res.json({
      message: 'Login successful',
      token,
      user:{
        id: user.id,
        fullName: user.fullname,
        email: user.email,
        phoneNumber: user.phoneNumber,
      }
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.verifyEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const result = await pool.query('SELECT * FROM userData WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const otp = generateOTP(); 

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP password is:",
      text: `Your OTP code is: ${otp}`,
    };

    try {
      await transporter.sendMail(mailOptions);

      req.session.otp = otp;
      req.session.email = email;
      req.session.otpExpires = Date.now() + 5 * 60 * 1000; 

      return res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {

      return res.status(502).json({ message: "Error sending OTP" });
    }
  } catch (error) {
    console.error("Error in /verify-email:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    console.log(req.body)
    if (!otp) {
        console.log("Error because otp is not provided")
      return res.status(400).json({ message: "OTP is required" });
    }

    console.log(req.session.otp)
    console.log(req.session.otpExpires)
    console.log(req.session.otpVerified)

    if (!req.session.otp || !req.session.otpExpires) {
        console.log("Error because otp is not found or expired")
      return res.status(404).json({ message: "OTP not found or expired. Please request again." });
    }

    if (Date.now() > req.session.otpExpires) {
        console.log("Error because otp has expired")
      return res.status(410).json({ message: "OTP has expired. Please request again." });
    }

    if (otp === req.session.otp) {
      req.session.otpVerified = true;
      req.session.otp = null;
      req.session.otpExpires = null;

      return res.status(200).json({ message: "OTP verified successfully" });
    }

    return res.status(401).json({ message: "Invalid OTP" });
  } catch (error) {
    console.error("Error in verifyOTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



exports.updatePassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!req.session.otpVerified || !req.session.email) {
      return res.status(403).json({ message: "Unauthorized or session expired" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const email = req.session.email;
    console.log("Updating password for email:", email);
    const query = `
      UPDATE "userdata"
      SET password = $1
      WHERE email = $2
      RETURNING email
    `;

    const result = await pool.query(query, [hashedPassword, email]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    req.session.otpVerified = null;
    req.session.email = null;

    return res.status(201).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
