const express = require('express');
const authRouter = express.Router();
const userModel = require('../database/userModel');

authRouter.post('/auth', (req, res) => {
    const { email, password, name, authMode } = req.body;
    // sign in
    if (authMode === 'signin') {
        userModel.authenticateUser(email, password, (err, pwdCorrect, userExists) => {
            if (err) {
                res.send({ success: false, message: "Server error" });
                return;
            }

            if (pwdCorrect && userExists) {
                res.send({ success: true, message: "Sign in success" });
            }else if(!userExists) {
                res.send({ success: false, message: "User does found" });
            } 
            else if(userExists && !pwdCorrect) {
                res.send({ success: false, message: "Incorrect password" });
            }

        });
    }else {
        // sign up
        userModel.addUser(name, email, password, (err, userExists) => {
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


module.exports = authRouter;
