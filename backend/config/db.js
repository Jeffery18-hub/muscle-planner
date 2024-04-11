import mongoose from 'mongoose';

const {DATABASE_REMOTE, DATABASE_PASSWORD} = process.env;
const DB_URL = DATABASE_REMOTE.replace('<PASSWORD>', DATABASE_PASSWORD);

mongoose.set('strictQuery', false);

mongoose
  .connect(DB_URL)
  .then(() => console.log('DB connection successful!'))
  .catch((err) => {
    console.log(err);
  });

const connection = mongoose.connection;

export default connection;