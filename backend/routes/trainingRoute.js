import { Router } from 'express';
const trainingRouter = Router();
import { addTrainingData, getTrainingDataByUserId, getTrainingDataByUserIdAndExercise } from '../models/trainingModel.js';
import { mainDB } from '../database/dbConfig.js';

trainingRouter.post('/', (req, res) => {
    const { uid, date, data } = req.body;
    // Convert each addTrainingData call to a promise
    let trainingPromises = data.map(element => {
        return new Promise((resolve, reject) => {
            //TODO: transaction, anyone fail leads to all failure
            addTrainingData(mainDB,uid, new Date(date), element.muscle, element.exercise, 
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

// this is for calendar: get all user data and then filter by date range
trainingRouter.get('/calendar', (req, res) => {
    // console.log(req.query);
    const { id, startDate, endDate } = req.query;
    getTrainingDataByUserId(mainDB, parseInt(id,10), (err, trainingData) => {
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

// this is for the visualizer: get user data on exercise
trainingRouter.get('/visualizer', (req, res) => {
    const {id, exercise} = req.query;
    getTrainingDataByUserIdAndExercise(mainDB, parseInt(id,10), exercise, (err, trainingData) => {
        if (err) {
            res.status(500).send({ success: false, message: "Failed to get training data. Please try again later." });
        } else {
            // restructure the data to be in a format that the visualizer can use
            const sendData = trainingData.map(training => {
                return {
                    date: timestampToStr(training.date),
                    muscle: training.muscle,
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

// this is for the gpt prompt: get user's whole data
trainingRouter.get('/gpt', (req, res) => {
    const {id} = req.query;
    getTrainingDataByUserId(mainDB, parseInt(id,10), (err, trainingData) => {
        if (err) {
            res.status(500).send({ success: false, message: "Failed to get training data. Please try again later." });
        } else {
            // restructure the data to be in a format that the gpt can use
            const sendData = trainingData.map(training => {
                return {
                    date: timestampToStr(training.date),
                    muscle: training.muscle,
                    exercise: training.exercise,
                    sets: training.sets,
                    repetitions: training.repetitions,
                    maximum: training.maximum,
                }
            });
            res.send(sendData);
        }
    });

})



const timestampToStr = (timestampToConvert) => {
    let date = new Date(timestampToConvert);
    let year = date.getFullYear(); // get year
    let month = date.getMonth() + 1; // get month
    let day = date.getDate(); // date

    let formattedDate = year + '-' + month.toString().padStart(2, '0') + '-' + day.toString().padStart(2, '0');
    return formattedDate;
}

export default trainingRouter;
