module.exports = (sequelize, DataTypes) => {
    const Anggota = sequelize.define('Anggota', {
        nama: {
            type: DataTypes.STRING,
            allowNull: false
        },
        NIM: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        kelompokId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'DataKelompoks', 
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        }});

    Anggota.associate = models => {
        Anggota.belongsTo(models.DataKelompok, {
            foreignKey: 'kelompokId',
            as: 'kelompok'
        });
    };

    return Anggota;
};