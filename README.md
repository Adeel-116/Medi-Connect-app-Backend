# 🧠 MediConnect Backend

Welcome to the **backend** of the MediConnect application — a robust, secure, and scalable healthcare API built with **Node.js**, **Express**, and **PostgreSQL**. This backend handles everything from user authentication (with OTPs and sessions) to database interactions, role-based access control, and email integration.

---

## 🚀 What This Backend Powers

- 🧑‍⚕️ Doctor & Patient roles
- 📩 OTP-based Email Verification  
- 🔐 Login with JWT + Session Management
- 📬 Nodemailer Integration for OTPs
- 🌐 Google OAuth Support
- 🛡️ Protected APIs using Middleware
- 🗃️ PostgreSQL with NEON Cloud Hosting

---

## 🛠️ Tech Stack

| Tech | Purpose |
|------------------|------------------------------------------|
| Node.js | JavaScript runtime |
| Express.js | API routing & middleware |
| PostgreSQL | Relational database (NEON Cloud) |
| JWT | Secure token-based authentication |
| Sessions | Express session for web compatibility |
| bcrypt | Password encryption |
| Nodemailer | Sending OTPs via Gmail |
| dotenv | Environment config |
| Google OAuth2 | Login via Google |

---

## 📂 Folder Structure

```
MediConnect-app-Backend/
├── controllers/        # All logic handlers
├── routes/            # API endpoints  
├── models/            # PostgreSQL queries / schema logic
├── middlewares/       # Route protection logic
├── utils/             # Helper functions
├── index.js           # App entry point
└── .env               # Environment variables (not included)
```

---

## 🧑‍💻 Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/Adeel-116/Medi-Connect-app-Backend.git
cd Medi-Connect-app-Backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create `.env` File
Create a `.env` file in the root directory and add the following variables:

```env
PORT=3000
DATABASE_URL=your_neon_postgresql_database_url
EMAIL=your_email@gmail.com
APP_PASSWORD=your_email_app_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

💡 **Tip**: You can use NEON to get a free cloud PostgreSQL database.

### 4. Start the Server
```bash
node index.js
```

Server will start on the specified `PORT` (default is 3000).

---

## 🔒 Authentication Flow

1. 📧 **User signs up or logs in** using email or Google
2. ✉️ **OTP sent** to email using Nodemailer  
3. 🔐 **OTP verified** → session started
4. 🪪 **Token generated (JWT)** and used for future requests
5. 🧑‍⚕️ Doctor/patient role managed via session

---

## 📬 Need Help with `.env` File?

🕵️ So you're trying to find the right variables but it's too confusing? Bro, be honest… you're looking at the code and thinking: "Yaar ye `GOOGLE_CLIENT_ID` kahan se laun? Neon ka link kya tha?" 😅

No worries! Just send me a message:

📧 **Email:** adeel116.dev@gmail.com  
💼 **LinkedIn:** Muhammad Adeel

I'll help you set it up in 5 minutes. Pinky promise. 🤝

---

## 🔧 Upcoming Features

* 🧑‍⚕️ Doctor-specific dashboard endpoints
* 🗓️ Appointment scheduling APIs  
* 🧾 Medical history and prescriptions module
* 📊 Admin role and analytics (Phase 2)

---

## 📄 License

This project is licensed under the **MIT License**. Feel free to fork, extend, or contribute.

Built with 💙 by **Muhammad Adeel**
