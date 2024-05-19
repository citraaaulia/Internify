module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      NIM: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: DataTypes.STRING,
      departemen: DataTypes.STRING,
      role: DataTypes.STRING,
    });
    return User;
  };
  