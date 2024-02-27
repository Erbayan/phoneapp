const fetch = require('node-fetch');
require('dotenv').config();

const apiKey = process.env.NewsApiKey;

async function getNews(req, res) {
    try {
        const response = await fetch(`https://newsapi.org/v2/everything?sources=techradar&q=phone&apiKey=${apiKey}`);
        const data = await response.json();

        if (data.status === 'ok') {
            res.render('news', { articles: data.articles });
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Произошла ошибка:', error.message);
        res.status(500).send('Произошла ошибка при получении новостей');
    }
}

module.exports = { getNews };
