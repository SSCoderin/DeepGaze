import { NextResponse } from "next/server";
import { Connect } from "../../database/Connect";
import User from "../../models/userModel";

export async function POST(req) {
  try {
    const { userid, username, useremail } = await req.json();
    
    if (!userid || !username || !useremail) {
      return NextResponse.json({ error: "User data is required" }, { status: 400 });
    }

    await Connect();
    //check user present 
    const existingUser = await User.findOne({ id: userid });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 200 });
    }

    const newUser = await User.create({
      id: userid,
      name: username,
      email: useremail
    });

    return NextResponse.json({ success: true, user: newUser, calibrate: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}