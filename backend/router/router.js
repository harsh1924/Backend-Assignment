const express = require('express');
const router = express.Router();
const { signup, signin, getUser, logout } = require('../controller/controller.js')
const jwtAuth = require('../middleware/jwtAuth.js')

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/user', jwtAuth, getUser);
router.get('/logout', jwtAuth, logout);

module.exports = router;