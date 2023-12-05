import { hash as _hash, compare } from 'bcrypt';

const saltRounds = 10;

const addUser = (db, name, email, password, callback) => {
    // check if the user exists
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.get(sql, [email], (err, row) => {
        if (err) { // server error
            callback(err, false);
            return;
        }

        if (row) { // user already exists
            callback(null, true);
        }
        else { // user does not exist
            // Hash the password
            _hash(password, saltRounds, (err, hash) => {
                if (err) { // hash error
                    callback(err,false);
                    return;
                }

                // Insert the user into the database
                const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
                db.run(sql, [name, email, hash], err => { // database error
                    callback(err,false);
                });
            });
        }
    })
};

const authenticateUser = (db, email, password, callback) => {
        const sql = 'SELECT password FROM users WHERE email = ?';
        db.get(sql, [email], (err, row) => {
            if (err) { // server error
                // first parameter is for the error; second is for password; third is for email
                callback(err, false, false);
                return;
            }
            if (row) { // user exists
                compare(password, row.password, (err, same) => {
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

export { addUser , authenticateUser };
