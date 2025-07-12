
import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // keep in .env.local
});

export async function POST(req) {
  try {
    const { content } = await req.json(); // note content to summarize

    // 🧠 Call OpenAI Chat Completion
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',  // you can also use 'gpt-3.5-turbo'
      messages: [
        { role: 'system', content: 'You are a helpful assistant that summarizes notes.' },
        { role: 'user', content: `Summarize this note: ${content}` },
      ],
    });

    const summary = completion.choices[0].message.content;

    return NextResponse.json({ summary });
  } catch (err) {
    console.error('OpenAI API error:', err);
    return NextResponse.json({ message: 'Failed to summarize' }, { status: 500 });
  }
}

