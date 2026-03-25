const express = require('express');
const router = express.Router();
const ctrl = require('../controller/userController');

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.get('/', ctrl.getAllUsers);
router.get('/:id', ctrl.getProfile);

module.exports = router;
