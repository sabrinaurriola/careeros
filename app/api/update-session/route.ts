import { NextResponse } from "next/server";
import Airtable from "airtable";

const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
});

const base = airtable.base(process.env.AIRTABLE_BASE_ID!);
const table = base(process.env.AIRTABLE_TABLE_NAME!);

export async function POST(request: Request) {
  const body = await request.json();

  const { recordId, fields } = body;

  if (!recordId || !fields) {
    return NextResponse.json(
      {
        success: false,
        message: "Missing recordId or fields",
      },
      { status: 400 }
    );
  }

  const updatedRecord = await table.update(recordId, fields);

  return NextResponse.json({
    success: true,
    recordId: updatedRecord.id,
    fields: updatedRecord.fields,
  });
}