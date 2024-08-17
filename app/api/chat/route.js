import { NextResponse } from 'next/server';

const apiKey = process.env.API_KEY;
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

export async function POST(request) {
  const { message } = await request.json();

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: message,
          },
        ],
      },
    ],
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text.trim();
    return new Response(generatedText, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    console.error('Error generating content:', error);
    return new Response('An error occurred while generating content.', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}
