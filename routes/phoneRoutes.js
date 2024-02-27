const express = require('express');
const router = express.Router();
const { getDeviceInfo } = require('../controllers/phoneController');
const authenticate = require('../middleware/authenticate');

router.get('/', authenticate, async (req, res) => {
    try {
        await getDeviceInfo(req, res); // Передаем управление в функцию getDeviceInfo
    } catch (error) {
        console.error('Error getting device info:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
