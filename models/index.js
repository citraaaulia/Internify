const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize('db_pweb', 'root', '', {
    host: 'localhost',
    port : '3306',
    dialect: 'mysql', 
});

const User = require('./User')(sequelize, Sequelize.DataTypes);


const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.DataKelompok = require('./dataKelompok')(sequelize, DataTypes);
db.Anggota = require('./Anggota')(sequelize, DataTypes);
db.User = require('./User')(sequelize, Sequelize.DataTypes);


if (db.DataKelompok.associate) {
  db.DataKelompok.associate(db);
}

if (db.Anggota.associate) {
  db.Anggota.associate(db);
}

sequelize.sync() 
  .then(() => {
    console.log('Model telah disinkronkan dengan basis data.');
  })
  .catch(err => {
    console.error('Gagal menyinkronkan model dengan basis data:', err);
  });

module.exports = {
  db,
  sequelize,
  User,
  DataKelompok: require('./dataKelompok')
};