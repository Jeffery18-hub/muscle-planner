import mongoose from "mongoose";
import { Schema } from "mongoose";

const trainingSchema = new mongoose.Schema({
    uid: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    muscle: {
        type: String,
        required: true
    },
    exercise: {
        type: String,
        required: true
    },
    repetitions: {
        type: Number,
        required: true
    },
    sets: {
        type: Number,
        required: true
    },
    maximum: {
        type: Number,
        required: true},
});

export default mongoose.model('Training', trainingSchema)

