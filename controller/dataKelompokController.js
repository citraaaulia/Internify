const { DataKelompok, Anggota } = require('../models');

// Mendapatkan semua data kelompok
exports.getAllDataKelompok = async (req, res) => {
  try {
    const dataKelompok = await DataKelompok.findAll({
      include: 'anggota'
    });
    res.json(dataKelompok);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Menambahkan data kelompok baru
exports.addDataKelompok = async (req, res) => {
  const { anggota } = req.body;

  try {
    const newDataKelompok = await DataKelompok.create();
    for (let member of anggota) {
      await Anggota.create({
        nama: member.nama,
        nim: member.nim,
        kelompokId: newDataKelompok.id
      });
    }
    res.status(201).json(newDataKelompok);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Menghapus data kelompok berdasarkan ID
exports.deleteDataKelompok = async (req, res) => {
  const { id } = req.params;

  try {
    const dataKelompok = await DataKelompok.findByPk(id);
    if (!dataKelompok) {
      return res.status(404).json({ error: 'Data kelompok tidak ditemukan' });
    }

    await dataKelompok.destroy();
    res.status(200).json({ message: 'Data kelompok berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
