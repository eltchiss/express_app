//routes de connexion et déconnexion
const express = require('express');
const router = express.Router();

const service = require('../services/users');

// POST /login
router.post('/login', service.login);

// GET /logout
router.get('/logout', service.logout);

module.exports = router;