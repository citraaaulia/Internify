const { User } = require('../models');
const bcrypt = require('bcryptjs');

exports.loginUser = async (req, res) => {
  console.log(req.body);
  const { NIM, password } = req.body;

  try {
    console.log(User);
    const user = await User.findOne({ where: { NIM } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid NIM or password.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid NIM or password.' });
    }

    req.session.userId = user.id;
    req.session.role = user.role;

    if (user.role === 'Sekretaris Jurusan') {
      res.redirect('/dashboardjurusan');
    } else if (user.role === 'Mahasiswa') {
      res.redirect('/UnggahProposal');
    } else {
      res.status(401).json({ message: 'Unauthorized: Role not recognized' });
    }
  } catch (err) {
    console.error(err); 
    res.status(500).json({ message: 'Something went wrong.', error: err });  }
};

exports.protectedRoute = (req, res) => {
  res.status(200).json({ message: 'This is a protected route', user: req.user });
};

exports.renderChangePasswordPage = (req, res) => {
  res.render('change-password');
};

exports.changePassword = async (req, res) => {
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
    console.error(err); 
    res.status(500).json({ message: 'Something went wrong.', error: err });  }
};
