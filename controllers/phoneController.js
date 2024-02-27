const axios = require('axios');
const gsmarena = require('gsmarena-api');
require('dotenv').config();

async function getDeviceInfo(req, res) {
    try {
        const query = req.query.q || 'iphone 15 pro';
        const imageUrl = await fetchPhoneImage(query);
        const phoneId = await fetchPhoneId(query);
        const deviceInfo = await getDeviceById(phoneId);
        res.render('phone', { deviceInfo, imageUrl });
    } catch (error) {
        console.error('Ошибка при получении данных о телефоне:', error.message);
        res.status(500).send('Ошибка при получении данных о телефоне');
    }
}
const RapidAPIKey= process.env.RapidAPIKey
async function fetchPhoneImage(query) {
    const options = {
        method: 'GET',
        url: 'https://mobile-phones2.p.rapidapi.com/search',
        params: { q: query }, 
        headers: {
            'X-RapidAPI-Key': RapidAPIKey,
            'X-RapidAPI-Host': 'mobile-phones2.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);

        if (Array.isArray(response.data) && response.data.length > 0 && response.data[0].image_url) {
            return response.data[0].image_url; 
        } else {
            throw new Error('Не удалось получить URL изображения из ответа API');
        }
    } catch (error) {
        throw new Error('Не удалось получить изображение: ' + error.message);
    }
}
async function fetchPhoneId(query) {
    const options = {
        method: 'GET',
        url: 'https://mobile-phones2.p.rapidapi.com/search',
        params: { q: query }, 
        headers: {
            'X-RapidAPI-Key': '7c781994b7mshafa3e0988f46dcdp194e81jsnfa8a5e788ecc',
            'X-RapidAPI-Host': 'mobile-phones2.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);

        if (Array.isArray(response.data) && response.data.length > 0 && response.data[0].id) {
            return response.data[0].id; 
        } else {
            throw new Error('Не удалось получить ID из ответа API');
        }
    } catch (error) {
        throw new Error('Не удалось получить ID: ' + error.message);
    }
}
const getDeviceById = async (phoneId) => {
    try {
        const deviceInfo = await gsmarena.catalog.getDevice(phoneId);
        return {
            name: deviceInfo.name,
            quickSpec: deviceInfo.quickSpec,
        };
    } catch (error) {
        throw new Error('Не удалось получить информацию об устройстве: ' + error.message);
    }
};


module.exports = { getDeviceInfo };
