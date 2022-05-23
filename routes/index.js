if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

const express = require('express');
const { append } = require('express/lib/response');
const router = express.Router();













router.get('/', (req, res, next) => {
  res.render('index', { page: 'Accueil' });
});

router.get('/about', (req, res, next) => {
  res.render('about', { page: 'À propos' });
});

router.get('/login', (req, res, next) => {
  res.render('login', { page: 'Connection' });
});

router.get('/register', (req, res, next) => {
  res.render('register', { page: 'Indentification' });
});




module.exports = router;
