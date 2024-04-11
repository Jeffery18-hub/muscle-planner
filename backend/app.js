import express, { json } from 'express';
import cors from 'cors';
import userRouter from './routers/userRouter.js';
import youtubeRouter from './routers/youtubeRouter.js';
import trainingRouter from './routers/trainingRouter.js';
import gptRouter from './routers/gptRouter.js'; 

const app = express();

app.use(cors());
app.use(json());


app.get("/", (_req, res) => {
  res.json("Hello World");
})

app.use("/api/user", userRouter);
app.use("/api/training", trainingRouter);

// app.use("/youtube", youtubeRouter);
// app.use("/home", trainingRouter);
// app.use("/dashboard", trainingRouter);
// app.use("/gpt", gptRouter);


export default app;