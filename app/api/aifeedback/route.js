import { NextResponse } from "next/server";

import { GoogleGenerativeAI } from "@google/generative-ai";
export async function POST(req) {
  try {
    const { taskdata, analysisData } = await req.json();
    const AIAnalysis = await GetAnalysis(taskdata, analysisData);
    return NextResponse.json({ success: true, AIAnalysis: AIAnalysis });
} catch (error) {
      console.log(error)    
    return NextResponse.json(
      { error: error.message || "An unknown error occurred" },
      { status: 500 }
    );
  }
}

async function GetAnalysis(taskdata, analysisData) {
    console.log(JSON.stringify(analysisData), JSON.stringify(taskdata));
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
 
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
 const prompt =`You are given two arrays: analysisData :${JSON.stringify(analysisData)} and taskData :${JSON.stringify(taskdata)}.\n\n
          - \`index\`: Index of the task
   - \`totalEvents\`: Number of events tracked
   - \`totalDuration\`: Total time spent
   - \`elements\`: Array of \`{id, duration, timestamp}\` for each code element viewed

2. \`taskData\`: A list of code tasks where each item contains:
   - \`_id\`, \`user_id\`, \`type\` (like "Code"), \`question\` (task title)
   - \`codelines.code\`: A map of line identifiers (like \`"swap_elements"\`, \`"function_call"\`, etc.)
   - \`result\`: Final output after running the code

Match each \`analysisData\` entry with the corresponding \`taskData\` using the \`index\`.

For each match, generate a JSON object with:
- \`"task"\`: Title from \`question\`
- \`"exam_level_analysis"\`: One of \`"easy"\`, \`"medium"\`, or \`"hard"\` **from the user's perspective**, based on:
   - Total duration
   - Number of events
   - Number of important code elements **skipped or viewed too briefly** (duration < 100ms)
   - Many skipped elements + low time = hard; Few skips + more time = medium; All covered smoothly = easy
- \`"strengths"\`: List of content areas that are **covered well** by the user's \`elements\`: write down the list  fo the  code topice where user understand peoperly by analysis the data ,check how user si spending time on each ,describe the strengths of the user in list form contain the sentense
- \`"areas_for_improvement"\`: List of content that user found difficult to understand , check how user si spending time on each ,describe the areas (topic where user found difficult) of the user in list form contain the sentense

Return the output in the following structured JSON format:`;
        

    const result = await model.generateContent(prompt);

    const response = await result.response;
return response.text()

}
