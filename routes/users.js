var express = require('express');
var router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const { authenticate, ensureAuthenticated } = require('../middleware/auth');

router.get('/protected', authenticate, (req, res) => {
  res.status(200).json({ message: 'This is a protected route', user: req.user });
});

router.post('/login', async (req, res) => {
  const { NIM, password } = req.body;

  try {
    const user = await User.findOne({ where: { NIM } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid NIM or password.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid NIM or password.' });
    }

    req.session.userId = user.id;
    res.redirect('/DataKelompok');
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

// Definisikan fungsi callback
const renderChangePasswordPage = (req, res) => {
  res.render('change-password');
};

// Gunakan fungsi callback di router
router.get('/change-password', ensureAuthenticated, renderChangePasswordPage);


// Proses perubahan password
router.post('/change-password', ensureAuthenticated, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findByPk(req.session.userId);
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.redirect('/login');
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

module.exports = router;
