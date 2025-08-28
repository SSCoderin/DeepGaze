import { NextResponse } from "next/server";
import Code from "@/app/models/codeModel";
import { Connect } from "@/app/database/Connect";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET(req) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    await Connect();
    const userCodes = await Code.find({ user_id: userId }).lean();
    return NextResponse.json({ success: true, codes: userCodes });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { user_id, type, question, code_content } = await req.json();
    console.log("POST request received:", { user_id, type, question, code_content });

    console.log("Calling processCodeWithGemini...");
    const codelines = await processCodeWithGemini(question, code_content);
    console.log("Gemini processing complete. Resulting codelines:", JSON.stringify(codelines, null, 2));

    console.log("Connecting to database...");
    await Connect();
    console.log("Database connected. Attempting to create new Code document...");
    const newCode = await Code.create({
      user_id,
      type,
      question,
      code_content,
      codelines,
    });
    console.log("New Code document created successfully:", newCode);

    return NextResponse.json({ success: true, code: newCode });
  } catch (error) {
    console.error("Error in POST /api/code:", error);
    return NextResponse.json({ error: error.message || "An unknown error occurred" }, { status: 500 });
  }
}

async function processCodeWithGemini(question, code_content) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
 
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Given the following question and code, please provide a JSON object with the following structure:
    {
      "question": "your_question_here",
      "code": {
        "line_key_1": "code_line_1",
        "line_key_2": "code_line_2"
        // ... more code lines with descriptive keys (e.g., "for_loop_condition", "variable_declaration", "function_call", "return_statement")
      },
      "result": "only_output_of_the_code_if_any, then start the explain the output in 1 or 2 line only"
    }

    Split the code into individual lines also mantaint the indentation and provide descriptive keys for each line. If a line is a part of a larger construct (like a loop or a function), try to make the key reflect that.
    Ensure your response contains ONLY the JSON object, with no surrounding text, markdown formatting (like triple backticks), or comments.

    Question: ${question}
    Code:
    ${code_content}
    `;

    console.log("Gemini Prompt:", prompt);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let fullResponse = response.text();
    console.log("Raw Gemini Response (string):", fullResponse);

   const jsonMatch = fullResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      fullResponse = jsonMatch[1].trim();
      console.log("Stripped Gemini Response (after markdown removal):", fullResponse);
    } else {
      console.warn("Gemini response did not contain expected markdown code block, attempting to parse as is.");
    }

    try {
      const parsedResponse = JSON.parse(fullResponse);
      console.log("Parsed Gemini Response (object):", JSON.stringify(parsedResponse, null, 2));
      return parsedResponse;
    } catch (parseError) {
      console.error("Error parsing Gemini response as JSON:", parseError);
      console.error("Gemini raw response that failed parsing (after stripping markdown):", fullResponse);
      throw new Error("Failed to parse AI response into JSON format. Raw response after stripping: " + fullResponse);
    }
  } catch (error) {
    console.error("Error in processCodeWithGemini:", error);
    throw new Error("Failed to process code with AI: " + error.message);
  }
}