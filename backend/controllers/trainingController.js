//TODO: add traning controllers after adding fake data

import trainingModel from "../models/trainingModel.js";

export const get_TrainingData = (req, res)=> {
  const userId = req.params.id;
  try {
    const allTrainingEntries = trainingModel.find((uid)=> uid === userId);
    res.status(200).json({
      message: "OK",
      payload: allTrainingEntries
    })
  } catch (error) {
    res.status(500).json({
      message: "The server has error"
    })
  }
};

export const post_TrainingData = (req, res) => {
  const userId = req.params.id
}

export const patch_TrainingData = (req, res) => {
  const userId = req.params.id
};
