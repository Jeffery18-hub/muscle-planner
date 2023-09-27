const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/authRoute');
const youtubeRouter = require('./routes/youtubeRoute');
const app = express();
const port = 5001;
const path  = require('path')

const _dirname = path.dirname("")
const buildPath = path.join(_dirname  , "../frontend/build");

app.use(express.static(buildPath))

app.get("/*", function(req, res){

    res.sendFile(
        path.join(__dirname, "../frontend/build/index.html"),
        function (err) {
          if (err) {
            res.status(500).send(err);
          }
        }
      );

})

app.use(cors());
app.use(express.json());

app.use(authRouter);
app.use(youtubeRouter);

// app listen on port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});