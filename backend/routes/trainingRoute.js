const express = require('express');
const trainingRouter = express.Router();
const Training = require('../database/trainingModel');

// userRouter.post('/auth', (req, res) => {
//     const { email, password, name, authMode } = req.body;
//     // sign in
//     if (authMode === 'signin') {
//         User.authenticateUser(email, password, (err, result) => {
//             if (err) {
//                 console.log("error message:", err);
//             }else {
//                 console.log("no error:", result);
//             }
//         });
//     }else {
//         // sign up
//         User.addUser(name, email, password, err => {
//             console.log(err);
//         })
//     }
// });


// module.exports = userRouter;
