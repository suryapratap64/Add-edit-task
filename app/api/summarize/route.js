import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { content } = await req.json();

    if (!content) {
      return Response.json({ error: "No content provided" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const prompt = `Summarize this text in clear, short, and simple language:\n\n${content}`;

    // Try the requested Gemini model first. If it's unavailable (404),
    // fall back to a broadly-available v1beta model so the API still works.
    let summary;
    try {
      const model = genAI.getGenerativeModel({
        model: "models/gemini-1.5-flash",
      });
      const result = await model.generateContent(prompt);
      summary = result.response.text();
    } catch (e) {
      // If the model is not found for this API version, try a fallback model.
      console.warn(
        "Primary model failed, attempting fallback model:",
        e?.message || e
      );
      if (
        e?.status === 404 ||
        (e?.message && e.message.includes("not found"))
      ) {
        try {
          const fallback = genAI.getGenerativeModel({
            model: "models/text-bison-001",
          });
          const res2 = await fallback.generateContent(prompt);
          summary = res2.response.text();
        } catch (e2) {
          console.error("Fallback model also failed:", e2);
          throw e2;
        }
      } else {
        throw e;
      }
    }

    return Response.json({ summary });
  } catch (err) {
    console.error("Gemini Error:", err);
    return Response.json({ error: "Failed to summarize" }, { status: 500 });
  }
}
