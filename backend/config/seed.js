import { faker } from '@faker-js/faker';
import userModel from '../models/userModel.js';
import trainingModel from '../models/trainingModel.js';
import argon2 from "argon2";
import mongoose from 'mongoose'
import "dotenv/config.js";


const {DATABASE_REMOTE, DATABASE_PASSWORD} = process.env;
const DB_URL = DATABASE_REMOTE.replace('<PASSWORD>', DATABASE_PASSWORD);

// Fake users
const USER_NUMBER = 3;
// Fake Training
const TRAINING_NUMBER = USER_NUMBER * 10;

// exercise and muscle pairs
const EXERCISE_MUSCLE_PAIR_ARRAY = [
  ["squat", "legs"],
  ["bench press", "chest"],
  ["deadlift", "back"],
  ["bent-over row", "back"],
  ["dumbbell row", "back"],
  ["romanian deadlift", "legs"],
  ["leg curl", "legs"],
  ["leg press", "legs"],
  ["dumbbell curl", "arms"],
  ["dumbbell press", "arms"],
  ["tricep pushdown", "arms"],
  ["lateral raise", "arms"],
  ["seated or standing calf raises", "legs"],
]

const createRandomUser = ()=>{
  return {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    // avatar: faker.image.avatar(),
    password: faker.internet.password(),
  };
}

// FIXME: Think about how to do concurrently? using promises.all
const addUsersToDB = async (USERS) => {
  const uid_array = [];
  for (const element of USERS) {
    const {username, email, password} = element;
    const hashedPassword = await argon2.hash(password);
    try {
      const newUser = await userModel.create({
        username,
        email,
        password: hashedPassword,
      });
      uid_array.push(newUser._id);
      console.log("New user:", newUser._id);
      console.log(`User ${newUser.username} is added!`);
    } catch (error) {
      console.error("Add user failer:", error.message);
    }
  }

  return uid_array;
}

const createTrainingData = (uid_array) => {
  const ret = [];
  for(let i = 0; i < TRAINING_NUMBER; i++) {
    ret.push({
      uid: uid_array[i % uid_array.length],
      date: faker.date.recent(20),
      exercise: EXERCISE_MUSCLE_PAIR_ARRAY[i % EXERCISE_MUSCLE_PAIR_ARRAY.length][0],
      muscle: EXERCISE_MUSCLE_PAIR_ARRAY[i % EXERCISE_MUSCLE_PAIR_ARRAY.length][1],
      repetitions: faker.datatype.number({min: 5, max: 15}),
      sets: faker.datatype.number({min: 3, max: 8}),
      maximum: faker.datatype.number({min: 40, max: 100}),
    })
  }

  return ret;
}

const addTrainToDB = async (data) => {
  for (const element of data) {
    try {
      const newTraining = await trainingModel.create(element);
      console.log(`Training ${newTraining} is added!`);
    } catch (error) {
      console.error("Add training failer:", error.message);
    }
  }
}


async function run() {
  try {
    await mongoose.connect(DB_URL);
    console.log("Connected successfully to db");
    await userModel.collection.drop();
    console.log("Drop user collection")
    const USERS = faker.helpers.multiple(createRandomUser, {
      count: USER_NUMBER,
    });
    const uids = await addUsersToDB(USERS);
    const trainingData = createTrainingData(uids);
    await addTrainToDB(trainingData);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.connection.close();
  }
}


run();