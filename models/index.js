const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('db_pweb', 'root', '', {
    host: 'localhost',
    dialect: 'mysql', 
});

const User = require('./User')(sequelize, Sequelize.DataTypes);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./User')(sequelize, Sequelize);

module.exports = {
  db,
  sequelize,
  User
};


