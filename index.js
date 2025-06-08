// index.js
const express = require('express');
const bcrypt = require('bcrypt')
const {connectDB, pool} = require('./src/config/db');  // Ensure path is correct

const app = express();
const port = 3000;

connectDB()

app.post('/signup', async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ error: 'Please provide fullName, email, and password' });
  }

  try {
    // Password hash karo (salt rounds = 10 recommended)
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (fullName, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, fullName, email
    `;
    const values = [fullName, email, hashedPassword];

    const result = await pool.query(query, values);

    res.status(201).json({ message: 'User created', user: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


app.listen(port, () => {
  console.log(`🚀 Server listening on http://localhost:${port}`);
});
