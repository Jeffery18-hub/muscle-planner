import app from "./app.js";
import "dotenv/config.js";
// why this way to import: reference as below
// https://stackoverflow.com/questions/64620877/cant-use-dotenv-with-es6-modules
import connection from "./config/db.js";

// connect to db and start server
const port = process.env.PORT;
connection.once("open", () => {
    app.listen(port, () => {
        console.log(`Server is running on port: ${port}`);
    })
})