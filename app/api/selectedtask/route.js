import { NextResponse } from "next/server";
import { Connect } from "@/app/database/Connect";
import Task from "@/app/models/taskModel";



export async function POST(req) {
    try {
        const { user_id, task_title, type } = await req.json();
        await Connect();
        const task = await Task.findOne({
            $and: [
                { user_id: user_id },
                { task_title: task_title },
                { type: type }
            ]
        }).lean();
        return NextResponse.json({ success: true, task: task });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}