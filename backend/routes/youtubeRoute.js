const express = require('express');
const axios = require('axios');
const fs = require('fs');
require('dotenv').config();
const youtubeRouter = express.Router();
let api_key = null;
const base_url = 'https://www.googleapis.com/youtube/v3';

api_key = process.env.YOUTUBE_API_KEY;
//api_key = 'AIzaSyBMbtny_A1BkKwLHbpHaWI1w_a2PPfzsxo'
console.log(api_key)


youtubeRouter.get('/', async (req, res, next) => {
    console.log(req);
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