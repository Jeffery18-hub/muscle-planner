import express, { json } from 'express';
import cors from 'cors';
import authRouter from './routes/authRoute.js';
import youtubeRouter from './routes/youtubeRoute.js';
import trainingRouter from './routes/trainingRoute.js';
import gptRouter from './routes/gptRoute.js'; 

const app = express();

app.use(cors());
app.use(json());

app.use("/auth",authRouter);
app.use("/youtube", youtubeRouter);
app.use("/home", trainingRouter);
app.use("/dashboard", trainingRouter);
app.use("/gpt", gptRouter);


export default app