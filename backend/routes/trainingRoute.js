const express = require('express');
const trainingRouter = express.Router();
const trainingModel = require('../database/trainingModel');

trainingRouter.post('/', (req, res) => {
    const { uid, date, muscle, exercise, sets, repetitions, maximum} = req.body;
    
    trainingModel.addTraining(uid, date, muscle, exercise, sets, repetitions, maximum, (err, trainingAdded) => {
        if (err) {
            res.send({ success: false, message: "Failed to add training. Please try again later." });
            return;
        }

        if(trainingAdded) {
            res.send({ success: true, message: "Training added successfully" });
            return;
        }
    })
})


module.exports = trainingRouter;
