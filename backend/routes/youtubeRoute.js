const express = require('express');
const axios = require('axios');
const fs = require('fs');
const youtubeRouter = express.Router();
let api_key = null;
const base_url = 'https://www.googleapis.com/youtube/v3';

// readFile is asynchronous
fs.readFile('./config.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }
    const config = JSON.parse(data);
    api_key = config.youtubeKey;
});


youtubeRouter.get('/search', async (req, res, next) => {
    try {
        const searchQuery = req.query.search_query;
        const maxResults = 10; 
        const response = await axios.get(`${base_url}/search?key=${api_key}&type=video&part=snippet&maxResults=${maxResults}&q=${searchQuery}`);
        const videoIDs = response.data.items.map(item => item.id.videoId);
        res.send(videoIDs);
    } catch (error) {
        next(error);
    }
});

module.exports = youtubeRouter;