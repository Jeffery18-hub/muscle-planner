import { Router } from 'express';
const authRouter = Router();
import { authenticateUser, addUser } from '../models/userModel.js';
import { mainDB } from '../database/dbConfig.js';

authRouter.post('/', (req, res) => {
    const { email, password, name, authMode } = req.body;
    // sign in
    if (authMode === 'signin') {
        authenticateUser(mainDB,email, password, (err, pwdCorrect, userExists) => {
            if (err) {
                res.status(500).send({ success: false, message: "Server error" });
                return;
            }

            if (pwdCorrect && userExists) {
                res.status(201).send({ success: true, message: "Sign in success" });
                console.log(res)
            
            }else if(!userExists) {
                res.status(401).send({ success: false, message: "User not found" });
            } 
            else if(userExists && !pwdCorrect) {
                res.status(401).send({ success: false, message: "Incorrect password" });
            }

        });
    }else {
        // sign up
        addUser(mainDB, name, email, password, (err, userExists) => {
            if (err) {
                res.status(500).send({ success: false, message: "Failed to add user. Please try again later." });
                return;
            } 
            
            if(userExists) {
                res.status(401).send({ success: false, message: "User already exists" });
            }else {
                res.status(201).send({ success: true, message: "Sign up success" });
            }
        })
    }
});


export default authRouter;
