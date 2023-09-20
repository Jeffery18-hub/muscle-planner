const db = require('./dbConfig.js');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const addUser = (name, email, password, callback) => {
    // Hash the password
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) { // hash error
            callback(err);
            return;
        }

        // Insert the user into the database
        const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        db.run(sql, [name, email, hash], err => { // database error
            callback(err);
        });
    });
};

const authenticateUser = (email, password, callback) => {
    const sql = 'SELECT password FROM users WHERE email = ?';
    db.get(sql, [email], (err, row) => {
        if (err) { // server error
            // first parameter is for the error; second is for password; third is for email
            callback(err, false, false); 
            return;
        }
        if (row) { // user exists
            bcrypt.compare(password, row.password, (err, same) => {
                if (err) { // hash error in bcrypt function
                    callback(err, false, false);
                    return;
                }
                callback(null, same, true);  // res is true or false, and null is for the error
            });
        } else { // user does not exist
            callback(null, false, false); // no user with that email
        }
    });
};

module.exports = {
    addUser,
    authenticateUser
};
