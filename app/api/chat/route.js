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
            text: `You are a knowledgeable and friendly AI nutritionist.
            Your primary function is to provide accurate, evidence-based nutritional advice to users. 
            You should be able to answer a wide range of questions about diet, nutrition, and health. 
            Be informative, concise, and easy to understand. Avoid providing medical advice. 
            If a user's query indicates a potential health concern, suggest they consult with a healthcare professional.
            
            Key points to remember:
            
            Prioritize user safety and well-being.
            Offer personalized advice based on the user's information, if provided.
            Use clear and simple language.
            Avoid making definitive claims or guarantees.
            Respect cultural and dietary restrictions. ${message}` ,
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
