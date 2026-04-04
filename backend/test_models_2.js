const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
dotenv.config({ path: 'd:/Hackathon X Charusat/RepoLens/backend/.env' });

async function list() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log("Testing with gemini-2.0-flash...");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent("test");
    console.log("Success with gemini-2.0-flash");
  } catch (e) {
    console.log("Failed with gemini-2.0-flash:", e.status, e.statusText);
  }
}
list();
