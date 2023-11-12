const express = require('express');
const trainingRouter = express.Router();
const trainingModel = require('../database/trainingModel');

trainingRouter.post('/', (req, res) => {
    const { uid, date, data } = req.body;
    // Convert each addTrainingData call to a promise
    let trainingPromises = data.map(element => {
        return new Promise((resolve, reject) => {
            
            console.log(uid, new Date(date), element.muscle, element.exercise, 
            parseInt(element.sets,10), parseInt(element.repetitions,10), 
            parseFloat(element.maximum));

            //TODO: transaction, anyone fail leads to all failure
            trainingModel.addTrainingData(uid, new Date(date), element.muscle, element.exercise, 
                parseInt(element.sets,10), parseInt(element.repetitions,10), 
                parseFloat(element.maximum), (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    });

    // Use Promise.all to wait for all promises to resolve or any to reject
    Promise.all(trainingPromises)
        .then(() => {
            res.send({ success: true, message: "Successfully added training data." });
        })
        .catch((err) => {
             // Log the error to the console for debugging
            console.error("An error occurred while adding training data:", err);
            res.status(500).send({ success: false, message: "Failed to add training. Please try again later." });
        });
});


module.exports = trainingRouter;
