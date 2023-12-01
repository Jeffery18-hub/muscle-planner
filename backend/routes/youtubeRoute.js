import dotenv from 'dotenv';
dotenv.config();
import { Router } from 'express';
import axios from 'axios';
const youtubeRouter = Router();
const base_url = 'https://www.googleapis.com/youtube/v3';
const api_key = process.env.YOUTUBE_API_KEY;


youtubeRouter.get('/', async (req, res, next) => {
//console.log(req);
    try {
        const searchQuery = req.query.search_query;
        const maxResults = 10; 
        //console.log(api_key)
        const response = await axios.get(`${base_url}/search?key=${api_key}&type=video&part=snippet&maxResults=${maxResults}&q=${searchQuery}`);
        const videoIDs = response.data.items.map(item => item.id.videoId);
        res.send(videoIDs);
    } catch (error) {
        next(error);
    }
});

export default youtubeRouter;