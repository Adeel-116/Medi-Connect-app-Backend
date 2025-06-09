const express = require('express');
const { connectDB } = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const cors = require('cors');
const session = require("express-session")
const app = express();
const port = 3000;

app.use(express.json());

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

connectDB();

app.use(session({
  secret: 'Adeelkareem122',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 5 * 60 * 1000 // example: 5 minutes
  }
}))



app.use('/', authRoutes);


app.listen(3000, '0.0.0.0', () => {
  console.log('Server is running');
});

