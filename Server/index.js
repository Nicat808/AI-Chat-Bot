import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
app.post("/gemini", async (req, res) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const chat = model.startChat({
    history: req.body.history
  });

  const result = await chat.sendMessage(req.body.prompt);
  const response = await result.response;
  const text = response.text();
  res.json({text})
});
app.listen(8080, () => {
  console.log("Server is awake");
})
