import express, { json } from 'express';
import cors from 'cors';
import authRouter from './routes/authRoute.js';
import youtubeRouter from './routes/youtubeRoute.js';
import trainingRouter from './routes/trainingRoute.js';
import gptRouter from './routes/gptRoute.js'; 
const app = express();
const port = 5001;
import path from 'path';

app.use(cors());
app.use(json());

//const _dirname = path.dirname("")
//const buildPath = path.join(_dirname  , "../frontend/build");

//app.use(express.static(buildPath));
app.use("/auth",authRouter);
app.use("/youtube", youtubeRouter);
app.use("/home", trainingRouter);
app.use("/dashboard", trainingRouter);
app.use("/gpt", gptRouter);

// app.get("/*", function(req, res){
//     res.sendFile(
//         path.join(__dirname, "../frontend/build/index.html"),
//         function (err) {
//           if (err) {
//             res.status(500).send(err);
//           }
//         }
//       );
// })



// app listen on port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});