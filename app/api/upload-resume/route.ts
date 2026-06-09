import { NextResponse } from "next/server";
import mammoth from "mammoth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({
        success: false,
        message: "No file uploaded",
      });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await mammoth.extractRawText({
      buffer,
    });

    return NextResponse.json({
      success: true,
      message: "Text extracted",
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      text: result.value,
    });
  } catch (error) {
    console.error("UPLOAD RESUME ERROR:", error);

    return NextResponse.json({
      success: false,
      message: "Upload failed",
    });
  }
}