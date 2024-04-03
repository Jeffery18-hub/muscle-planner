import app from "./app.js";
import connection from "./config/db.js";

// connect to db and start server
const port = process.env.PORT;
connection.once("open", () => {
    app.listen(port, () => {
        console.log(`Server is running on port: ${port}`);
    })
})