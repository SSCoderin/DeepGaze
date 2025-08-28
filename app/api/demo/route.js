import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export async function POST(req) {
  try {
    const message = await req.json();

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            { text: `remember the previous data : ${JSON.stringify(message.previousmessage)} also the page content where user is right now is : ${JSON.stringify(message.questiondata)} may be user can ask question about or on  as user is asking ${message.usermessage}and also make sure only have to response to the user asking  message only  please provide  teh responce in the json  format with the following structure: { "hint": "your response here" }` },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage(message.usermessage);
    let responseText = result.response.text();

    // Ensure the response is valid JSON
    responseText = responseText.replace(/```json|```/g, "").trim(); // Remove unnecessary formatting
    const responseJson = JSON.parse(responseText);

    return NextResponse.json(responseJson);
  } catch (error) {
    console.error("AI API Error:", error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}