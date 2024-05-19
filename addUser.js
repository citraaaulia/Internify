const bcrypt = require('bcryptjs');
const { User } = require('./models');
const sequelize = require('./models').sequelize;

const addUser = async () => {
  const NIM = '2111521022'; 
  const password = 'pwebA'; 
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await sequelize.sync(); 
    const user = await User.create({
      NIM,
      password: hashedPassword,
      name: 'Citra Aulia', 
      departemen: 'Sistem Informasi', 
      role: 'Mahasiswa', 
    });

    console.log('User added successfully:', user.toJSON());
  } catch (error) {
    console.error('Error adding user:', error);
  } finally {
    await sequelize.close();
  }
};

addUser();
