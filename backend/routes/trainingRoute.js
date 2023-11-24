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

trainingRouter.get('/calendar', (req, res) => {
    // console.log(req.query);
    const { id, startDate, endDate } = req.query;
    trainingModel.getTrainingDataByUserId(parseInt(id,10), (err, trainingData) => {
        if (err) {
            res.status(500).send({ success: false, message: "Failed to get training data. Please try again later." });
        } else {
            // Filter the training data by date range
            const filteredTrainingData = trainingData.filter(training => {
                return new Date(training.date) >= new Date(startDate) && new Date(training.date) < new Date(endDate);
            });

            // restructure the data to be in a format that the calendar can use
            const sendData = filteredTrainingData.map(training => {
                return {
                    title: training.exercise,
                    date: timestampToStr(training.date),
                }
            });

            res.send(sendData);
        }
    });
});

trainingRouter.get('/visualizer', (req, res) => {
    const {id, exercise} = req.query;
    trainingModel.getTrainingDataByUserIdAndExercise(parseInt(id,10), exercise, (err, trainingData) => {
        if (err) {
            res.status(500).send({ success: false, message: "Failed to get training data. Please try again later." });
        } else {
            // restructure the data to be in a format that the visualizer can use
            const sendData = trainingData.map(training => {
                return {
                    date: timestampToStr(training.date),
                    exercise: training.exercise,
                    sets: training.sets,
                    repetitions: training.repetitions,
                    maximum: training.maximum,
                }
            });
            res.send(sendData);
        }
    });
});



const timestampToStr = (timestampToConvert) => {
    let date = new Date(timestampToConvert);
    let year = date.getFullYear(); // 获取年份
    let month = date.getMonth() + 1; // 获取月份，月份从0开始计数，所以加1
    let day = date.getDate(); // 获取日

    let formattedDate = year + '-' + month.toString().padStart(2, '0') + '-' + day.toString().padStart(2, '0');
    return formattedDate;
}

module.exports = trainingRouter;
