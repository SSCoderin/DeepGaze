import { NextResponse } from "next/server";
import { Connect } from "@/app/database/Connect";
import StudentAiFeedback from "@/app/models/StudentAiFeedback";

export async function POST(req) {
  try {
    const {
      object_id,
      user_id,
      student_feedback,
      ai_feedback,
      student_conclusion,
    } = await req.json();
    await Connect();
    console.log(object_id, user_id, student_feedback, ai_feedback, student_conclusion);
    const newFeedback = await StudentAiFeedback.create({
      object_id,
      user_id,
      student_feedback,
      ai_feedback,
      student_conclusion,
    });
    return NextResponse.json({ success: true, feedback: newFeedback });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


export async function GET(req){
  try {
    const object_id = req.nextUrl.searchParams.get('object_id');
    await Connect();
    const feedback = await StudentAiFeedback.findOne({ object_id }).lean();
    return NextResponse.json({ success: true, feedback: feedback });
    
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

}