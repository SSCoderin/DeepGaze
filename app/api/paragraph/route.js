import { NextResponse } from "next/server";
import Paragraph from "@/app/models/paragraphModel";
import { Connect } from "@/app/database/Connect";



export async function POST(req) {
    try {
        const { user_id, type, title, content } = await req.json();
        await Connect();
        const newParagraph = await Paragraph.create({ user_id, type, title, content });
        return NextResponse.json({ success: true, paragraph: newParagraph });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


  export async function GET(req) {
      try {
          const userId = req.nextUrl.searchParams.get('userId');
          await Connect();
          const userParagraphs = await Paragraph.find({ user_id: userId }).lean();
          return NextResponse.json({ success: true, paragraphs: userParagraphs });
      } catch (error) {
          return NextResponse.json({ error: error.message }, { status: 500 });
      }
  }