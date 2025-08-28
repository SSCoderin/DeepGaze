import { NextResponse } from "next/server";
import Task from "@/app/models/taskModel";
import { Connect } from "@/app/database/Connect";






export async function POST(req) {
    try {
        const { user_id, task_title, type, task_content, url } = await req.json();
        await Connect();
        const newTask = await Task.create({ user_id, task_title, type, task_content, url });
        return NextResponse.json({ success: true, task: newTask });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}



export async function GET(req) {
    try {
        const userId = req.nextUrl.searchParams.get('userId');
        await Connect();
        const userTasks = await Task.find({ user_id: userId }).lean();
        return NextResponse.json({ success: true, tasks: userTasks });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}