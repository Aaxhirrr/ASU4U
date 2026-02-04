
import { NextResponse } from "next/server";
import { moderateContent } from "@/lib/safety/moderation";

// POST /api/moderation/check
export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        if (!text) {
            return NextResponse.json({ success: false, message: "No text provided" });
        }

        const result = await moderateContent(text);

        return NextResponse.json({
            success: true,
            result
        });
    } catch (error) {
        console.error("Moderation API error:", error);
        return NextResponse.json({ success: false, message: "Moderation failed" }, { status: 500 });
    }
}
