const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('db_pweb', 'root', 'password', {
  host: '127.0.0.1',
  dialect: 'mysql'
});
const authenticate = async (req, res, next) => {
    const { NIM, password } = req.body;
    try {
      const user = await UserModel.findOne({ where: { NIM } });
      if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = user.id; // Set user id in session
        next();
      } else {
        res.status(401).json({ message: 'Unauthorized' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error });
    }
  };

module.exports = sequelize;
