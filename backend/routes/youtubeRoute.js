const express = require('express');
const axios = require('axios');
const youtubeRouter = express.Router();
const api_key = 'AIzaSyC9aIax1XWLySUrZ6-lfwDN2LgHf39obQ4';  
const base_url = 'https://www.googleapis.com/youtube/v3';

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