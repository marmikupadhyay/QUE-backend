const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { verifyToken } = require('../middlewares/AuthMiddleWare');

router.get('/:user_id', verifyToken, UserController.getUserDetails);
router.post('/register', UserController.register);
router.post('/login', UserController.login);

module.exports = router;
