const express = require('express');
const router = express.Router();
const dataKelompokController = require('../controller/dataKelompokController');

router.get('/', dataKelompokController.getAllDataKelompok);
router.post('/', dataKelompokController.addDataKelompok);
router.delete('/:id', dataKelompokController.deleteDataKelompok);

module.exports = router;
