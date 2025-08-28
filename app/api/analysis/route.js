import { NextResponse } from "next/server";
import { Connect } from "@/app/database/Connect";
import Analysis from "@/app/models/analysisModel";
import Task from "@/app/models/taskModel";

export async function POST(request) {
  try {
    const {
      task_id,
      student_name,
      student_email,
      student_feedback,
      student_answer,
      analysis_data,
    } = await request.json();
    await Connect();
    const newAnalysis = await Analysis.create({
      task_id,
      student_name,
      student_email,
      student_feedback,
      student_answer,
      analysis_data,
    });
    return NextResponse.json({ success: true, analysis: newAnalysis });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const taskId = request.nextUrl.searchParams.get("taskId");
    await Connect();
    const analysis = await Analysis.find({ task_id: taskId }).lean();
    const task = await Task.findOne({ _id: taskId }).lean();
    return NextResponse.json({ success: true, task: task, analysis: analysis });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
