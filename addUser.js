const bcrypt = require('bcryptjs');
const { User } = require('./models');
const sequelize = require('./models').sequelize;

const addUser = async () => {
  const NIM = '123456789'; 
  const password = 'kptahun2025'; 
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await sequelize.sync(); 
    const user = await User.create({
      NIM,
      password: hashedPassword,
      name: 'Nindy Malisha', 
      departemen: 'Sistem Informasi', 
      role: 'Sekretaris Jurusan', 
    });

    console.log('User added successfully:', user.toJSON());
  } catch (error) {
    console.error('Error adding user:', error);
  } finally {
    await sequelize.close();
  }
};

addUser();
