const db = require('./dbConfig.js');

// add training data
const addTrainingData = (uid, date, muscle, exercise, sets, repetitions, maximum, callback) => {
    const sql = 'INSERT INTO training (uid, date, muscle, exercise, sets, repetitions, maximum) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.run(sql, [uid, date, muscle, exercise, sets, repetitions, maximum], function(err) {
        callback(err);
    });
};

// get training data by id
const getTrainingDataByUserId = (uid, callback) => {
    const sql = 'SELECT * FROM training WHERE uid = ?';
    db.all(sql, [uid], (err, rows) => {
        callback(err, rows);
    });
};

// get training data by id and exercise
const getTrainingDataByUserIdAndExercise = (uid, exercise, callback) => {
    const sql = 'SELECT * FROM training WHERE uid = ? AND exercise = ?';
    db.all(sql, [uid, exercise], (err, rows) => {
        callback(err, rows);
    });
}

// update training data
const updateTrainingData = (tid, date, muscle, exercise, sets, repetitions, maximum, callback) => {
    const sql = 'UPDATE training SET date = ?, muscle = ?, exercise = ?, sets = ?, repetitions = ?, maximum = ? WHERE tid = ?';
    db.run(sql, [date, muscle, exercise, sets, repetitions, maximum, tid], function(err) {
        callback(err);
    });
};

// delete training data
const deleteTrainingData = (tid, callback) => {
    const sql = 'DELETE FROM training WHERE tid = ?';
    db.run(sql, [tid], function(err) {
        callback(err);
    });
};

module.exports = {
    addTrainingData,
    getTrainingDataByUserId,
    updateTrainingData,
    deleteTrainingData,
    getTrainingDataByUserIdAndExercise
};
