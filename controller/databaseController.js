const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('mysql://root:@localhost:3306/db_pweb');

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

const DataKelompok = require('../models/dataKelompok')(sequelize, Sequelize.DataTypes);
const Anggota = require('../models/Anggota')(sequelize, Sequelize.DataTypes);

db.DataKelompok = DataKelompok;
db.Anggota = Anggota;

DataKelompok.associate(db);
Anggota.associate(db);

module.exports = db;
