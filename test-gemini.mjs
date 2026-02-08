import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testGemini() {
  try {
    const model = genAI.getGenerativeModel({
      model: "models/gemini-2.5-flash",
    });

    const result = await model.generateContent(
      "Reply with exactly: Gemini API is working"
    );

    console.log(result.response.text());
  } catch (error) {
    console.error("ERROR:", error.message);
  }
}

testGemini();

