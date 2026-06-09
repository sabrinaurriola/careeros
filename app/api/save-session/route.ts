import { NextResponse } from "next/server";
import Airtable from "airtable";
const airtable = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY,
});
const base = airtable.base(process.env.AIRTABLE_BASE_ID!);
const table = base(process.env.AIRTABLE_TABLE_NAME!);

export async function POST(request: Request) {
    const body = await request.json();

    const {
        sessionId,
        appVersion,
        jobOffer,
        resumeText,
        sessionStatus,
        source,
    } = body;

    if (!sessionId || !jobOffer || !resumeText) {
        return NextResponse.json(
            {
                success: false,
                message: "Missing required fields",
            },
            { status: 400 }
        );
    }
console.log("AIRTABLE_BASE_ID:", process.env.AIRTABLE_BASE_ID);
console.log(
  "AIRTABLE_API_KEY starts with:",
  process.env.AIRTABLE_API_KEY?.substring(0, 8)
);
    const createdRecord = await table.create([
        {
            fields: {
                "Session ID": sessionId,
                "App Version": appVersion,
                "Job Offer": jobOffer,
                "Resume Text": resumeText,
                "Session Status": sessionStatus,
                Source: source,
            },
        },
    ]);

    return NextResponse.json({
        success: true,
        recordId: createdRecord[0].id,
        received: {
            sessionId,
            appVersion,
            jobOffer,
            resumeText,
            sessionStatus,
            source,
        },
    });
}