const sqlite3 = require('sqlite3').verbose();

// create a new database called mydatabase.db
const db = new sqlite3.Database('./mydatabase.db', (err) => {
    if (err) {
        console.error("Error opening database " + err.message);
    } else {
        // initialize the database , users table
        db.run('CREATE TABLE IF NOT EXISTS users (\
            uid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,\
            name TEXT NOT NULL,\
            email TEXT UNIQUE NOT NULL,\
            password TEXT NOT NULL\
        )', (err) => {
            if (err) {
                console.log('Error creating users table:', err);
            }
        });

        // training table
        db.run('CREATE TABLE IF NOT EXISTS training (\
            tid INTEGER PRIMARY KEY AUTOINCREMENT,\
        uid INTEGER,\
        date DATE NOT NULL,\
        muscle TEXT NOT NULL,\
        exercise TEXT NOT NULL,\
        sets INTEGER NOT NULL,\
        repititions INTEGER NOT NULL,\
        maximum REAL,\
        FOREIGN KEY(uid) REFERENCES users(uid)\
        )', (err) => {
            if (err) {
                console.log('Error creating trainning table:', err);
            }
        });
    }
});


module.exports = db;
