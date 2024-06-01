module.exports = (sequelize, DataTypes) => {
    const DataKelompok = sequelize.define('DataKelompok', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true, 
            autoIncrement: true
        }
    });

    DataKelompok.associate = models => {
        DataKelompok.hasMany(models.Anggota, {
            foreignKey: 'kelompokId',
            as: 'anggota'
        });
    };

    return DataKelompok;
};
