import { Router } from 'express';
const authRouter = Router();
import { authenticateUser, addUser } from '../database/userModel.js';

authRouter.post('/', (req, res) => {
    const { email, password, name, authMode } = req.body;
    // sign in
    if (authMode === 'signin') {
        authenticateUser(email, password, (err, pwdCorrect, userExists) => {
            if (err) {
                res.send({ success: false, message: "Server error" });
                return;
            }

            if (pwdCorrect && userExists) {
                res.send({ success: true, message: "Sign in success" });
            }else if(!userExists) {
                res.send({ success: false, message: "User not found" });
            } 
            else if(userExists && !pwdCorrect) {
                res.send({ success: false, message: "Incorrect password" });
            }

        });
    }else {
        // sign up
        addUser(name, email, password, (err, userExists) => {
            if (err) {
                res.send({ success: false, message: "Failed to add user. Please try again later." });
                return;
            } 
            
            if(userExists) {
                res.send({ success: false, message: "User already exists" });
            }else {
                res.send({ success: true, message: "Sign up success" });
            }
        })
    }
});


export default authRouter;
