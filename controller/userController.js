var express = require('express');
var router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const { authenticate } = require('../middleware/auth');
const ensureAuthenticated = require('../middleware/auth');

exports.protectedRoute = (req, res) => {
  res.status(200).json({ message: 'This is a protected route', user: req.user });
};

exports.loginUser = async (req, res) => {
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
};
