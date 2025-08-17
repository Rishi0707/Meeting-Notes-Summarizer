// /app/api/summarize/route.ts
import { NextRequest, NextResponse } from 'next/server';

// RECOMMENDED: Store your Groq API key in .env.local, not hardcoded in code!
const GROQ_API_KEY = process.env.GROQ_API_KEY;
console.log(GROQ_API_KEY);
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.1-8b-instant'; // swap for your actual preferred model

export async function POST(req: NextRequest) {
  try {
    const { text, prompt } = await req.json();

    if (!text || !prompt) {
      return NextResponse.json({ error: 'Missing text or prompt.' }, { status: 400 });
    }

    const messages = [
      { role: 'system', content: 'You are an expert meeting assistant.' },
      { role: 'user', content: `${prompt}\n\n${text}` },
    ];
    console.log('Input text length:', text.length);
    console.log('Prompt:', prompt);


    const response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        max_tokens: 700,
        temperature: 0.4,
      }),
    });

    const result = await response.json();
console.log('Groq response:', JSON.stringify(result, null, 2));

    const summary = result?.choices?.[0]?.message?.content || '';
    return NextResponse.json({ summary });
  } catch (err) {
    console.error('SUMMARIZE ERROR:', err);
    return NextResponse.json({ error: err?.message || 'AI summary failed' }, { status: 500 });
  }
}
