var express = require('express');
var router = express.Router();
const { authenticate, ensureAuthenticated } = require('../middleware/auth');
const userController = require('../controller/userController');

router.get('/protected', authenticate, userController.protectedRoute);

router.post('/login', userController.loginUser);
router.post('/UnggahProposal', userController.loginUser);

router.get('/change-password', ensureAuthenticated, userController.renderChangePasswordPage);

router.post('/change-password', ensureAuthenticated, userController.changePassword);

module.exports = router;