const { User } = require('../models');
const bcrypt = require('bcrypt');
const sequelize = require('../server');
const { Sequelize } = require('sequelize');

const authenticate = async (req, res, next) => {
  const { NIM, password } = req.body;
  try {
    const user = await User.findOne({ where: { NIM } });
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = user.id;
        res.redirect('/dashboard');
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

const ensureAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return next();
    } else {
        res.redirect('/login');
    }
};

module.exports = {
    authenticate,
    ensureAuthenticated
  };
