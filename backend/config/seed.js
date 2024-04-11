import { faker } from '@faker-js/faker';
import userModel from '../models/userModel.js';
import argon2 from "argon2";
import mongoose from 'mongoose'
import "dotenv/config.js";


const {DATABASE_REMOTE, DATABASE_PASSWORD} = process.env;
const DB_URL = DATABASE_REMOTE.replace('<PASSWORD>', DATABASE_PASSWORD);
// Fake users
const USER_NUMBER = 5;

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
  for (const element of USERS) {
    const {username, email, password} = element;
    const hashedPassword = await argon2.hash(password);
    try {
      const newUser = await userModel.create({
        username,
        email,
        password: hashedPassword,
      });
      console.log(`User ${newUser.username} is added!`);
    } catch (error) {
      console.error("Add user failer:", error.message);
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
    await addUsersToDB(USERS);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.connection.close();
  }
}


run();

// TODO: Fake traning data