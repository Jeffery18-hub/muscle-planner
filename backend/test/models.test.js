import { testDB } from '../database/dbConfig';
import { addUser, authenticateUser } from '../models/userModel'

describe('userModel with callbacks', () => {
    test('addUser adds a user successfully', done => {
        const email = 'test@example.com';
        const password = 'password';
        const name = 'John Doe';

        addUser(testDB, name, email, password, (err, userExists) => {
            if (err) {
                done(err);
                return;
            }

            expect(userExists).toBe(false); // user does not exist in the database

            // check if the user was added to the database
            const sql = 'SELECT * FROM users WHERE email = ?';
            testDB.get(sql, [email], (err, row) => {
                if (err) {
                    done(err);
                    return;
                }

                expect(row).not.toBe(undefined); // user exists in the database
                expect(row.email).toBe(email);
                expect(row.name).toBe(name);

                done(); // test passed
            });
        });
    });

    // test cases for authenticateUser
    test("authenticateUser returns true if user exists and password is correct", done => {
        const email = 'test@example.com';
        const password = 'password';

        authenticateUser(testDB, email, password, (err, userExists, passwordCorrect) => {
            if (err) {
                done(err);
                return;
            }

            expect(userExists).toBe(true); // user exists in the database
            expect(passwordCorrect).toBe(true); // password is correct

            done(); // test passed

        })
    })
});