import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const hasKey = !!apiKey;
        const keyLength = apiKey?.length || 0;
        const keyStart = apiKey ? apiKey.substring(0, 5) : "NONE";

        // Check if we can import the package
        let packageStatus = "OK";
        try {
            await import("@google/genai");
        } catch (e: any) {
            packageStatus = `FAILED: ${e.message}`;
        }

        return NextResponse.json({
            status: "debug",
            env_var_found: hasKey,
            key_length: keyLength,
            key_preview: keyStart + "...",
            package_import: packageStatus,
            node_env: process.env.NODE_ENV,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
