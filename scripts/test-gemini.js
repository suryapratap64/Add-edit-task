// Small test script to verify Gemini model + API key
// - Reads .env in project root and sets process.env.GEMINI_API_KEY
// - Calls models/gemini-1.5-flash with a short prompt and prints response.text()

import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";

function loadDotEnv(envPath) {
  try {
    const raw = fs.readFileSync(envPath, "utf8");
    const lines = raw.split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx === -1) continue;
      const key = trimmed.substring(0, idx).trim();
      let val = trimmed.substring(idx + 1).trim();
      // Remove surrounding quotes
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  } catch (e) {
    // ignore
  }
}

(async () => {
  // load .env from repo root
  loadDotEnv(path.resolve(process.cwd(), ".env"));

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY not set in environment or .env");
    process.exit(2);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "models/gemini-1.5-flash",
    });

    const result = await model.generateContent("Say hello in 5 words");
    const text = result.response.text();
    console.log("MODEL RESPONSE:\n", text);
  } catch (err) {
    console.error("Test failed. Error from SDK:");
    // don't print full envs
    console.error(err);
    process.exit(1);
  }
})();
