const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/authRoute');
const youtubeRouter = require('./routes/youtubeRoute');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.use(authRouter);
app.use(youtubeRouter);

// app listen on port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});