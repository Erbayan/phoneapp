const express = require('express');
const router = express.Router();
const { getDeviceInfo } = require('../controllers/phoneController');

router.get('/', getDeviceInfo);

module.exports = router;
