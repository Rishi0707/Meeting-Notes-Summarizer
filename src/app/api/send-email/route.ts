// /app/api/send-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { summary, recipient } = await req.json();
    if (!summary || !recipient) {
      return NextResponse.json({ error: 'Missing summary or recipient.' }, { status: 400 });
    }

    // Set up test transporter using Ethereal (for real SMTP, update credentials)
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'maxwell.streich85@ethereal.email',
        pass: 'djFRzvWwNFbPnEa8je'  // replace with your ethereal or smtp creds
      },
    });

    const info = await transporter.sendMail({
      from: '"AI Notetaker" <no-reply@example.com>',
      to: recipient,
      subject: 'AI Meeting Summary',
      text: summary,
    });

    return NextResponse.json({ success: true, info });
  } catch (err) {
    console.error('MAIL ERROR:', err);
    return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 });
  }
}
