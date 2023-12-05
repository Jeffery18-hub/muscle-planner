import sqlite3 from'sqlite3';

// create a new database called mydatabase.db
const mainDB = new sqlite3.Database('./mydatabase.db', (err) => {
    if (err) {
        console.error("Error opening database " + err.message);
    } else {
        // initialize the database , users table
        mainDB.run('CREATE TABLE IF NOT EXISTS users (\
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
        mainDB.run('CREATE TABLE IF NOT EXISTS training (\
            tid INTEGER PRIMARY KEY AUTOINCREMENT,\
            uid INTEGER,\
            date DATE NOT NULL,\
            muscle TEXT NOT NULL,\
            exercise TEXT NOT NULL,\
            sets INTEGER NOT NULL,\
            repetitions INTEGER NOT NULL,\
            maximum REAL,\
            FOREIGN KEY(uid) REFERENCES users(uid)\
        )', (err) => {
            if (err) {
                console.log('Error creating trainning table:', err);
            }
        });
    }
});


// database for test
const testDB = new sqlite3.Database('./test_database.db', (err) => {
    if (err) {
        console.error("Error opening database " + err.message);
    } else {
        // initialize the database , users table
        testDB.run('CREATE TABLE IF NOT EXISTS users (\
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
        testDB.run('CREATE TABLE IF NOT EXISTS training (\
            tid INTEGER PRIMARY KEY AUTOINCREMENT,\
            uid INTEGER,\
            date DATE NOT NULL,\
            muscle TEXT NOT NULL,\
            exercise TEXT NOT NULL,\
            sets INTEGER NOT NULL,\
            repetitions INTEGER NOT NULL,\
            maximum REAL,\
            FOREIGN KEY(uid) REFERENCES users(uid)\
        )', (err) => {
            if (err) {
                console.log('Error creating trainning table:', err);
            }
        });
    }
});


export {mainDB, testDB};
