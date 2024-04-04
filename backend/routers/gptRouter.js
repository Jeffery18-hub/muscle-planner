import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();
import { Router } from "express";

const gptRouter = Router();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

gptRouter.get("/", async (req, res, next) => {
    try {
        const prompt = req.query.prompt;
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages:[
                {
                    role: "user",
                    content: prompt
                }
            ]
        });
        res.status(200).send(response.choices[0].message);
    } catch (error) {
        next(error);
    }
})

export default gptRouter;


