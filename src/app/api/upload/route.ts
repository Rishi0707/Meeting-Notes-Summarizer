import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    if (
      !file ||
      typeof file === 'string' ||
      !(file instanceof Blob)
    ) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    // Works for .txt files only!
    const buffer = await file.arrayBuffer();
    const text = new TextDecoder().decode(buffer);

    return NextResponse.json({ text });
  } catch (err) {
    console.error('UPLOAD ERROR:', err);
    return NextResponse.json({ error: err?.message || 'Failed to extract text' }, { status: 500 });
  }
}
