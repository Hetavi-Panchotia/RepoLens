const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
dotenv.config({ path: 'd:/Hackathon X Charusat/RepoLens/backend/.env' });

async function list() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // There is no direct listModels in the generative-ai SDK for Node yet in some versions, 
    // but we can try to test a different model name.
    console.log("Testing with gemini-1.5-flash...");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("test");
    console.log("Success with gemini-1.5-flash");
  } catch (e) {
    console.log("Failed with gemini-1.5-flash:", e.status, e.statusText);
    if (e.errorDetails) console.log(JSON.stringify(e.errorDetails));
    
    try {
        console.log("Testing with gemini-1.5-flash-latest...");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const result = await model.generateContent("test");
        console.log("Success with gemini-1.5-flash-latest");
    } catch (e2) {
        console.log("Failed with gemini-1.5-flash-latest:", e2.status, e2.statusText);
    }
  }
}
list();
