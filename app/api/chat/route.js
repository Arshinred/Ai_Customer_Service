import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure to set your API key in the environment variables
});

const systemPrompt = `You are a knowledgeable and friendly AI nutritionist. 
Your primary function is to provide accurate, evidence-based nutritional advice to users. 
You should be able to answer a wide range of questions about diet, nutrition, and health. 
Be informative, concise, and easy to understand. Avoid providing medical advice. 
If a user's query indicates a potential health concern, suggest they consult with a healthcare professional.

Key points to remember:

Prioritize user safety and well-being.
Offer personalized advice based on the user's information, if provided.
Use clear and simple language.
Avoid making definitive claims or guarantees.
Respect cultural and dietary restrictions.`;

export async function POST(req) {
    const data = await req.json();

    const completion = await openai.chat.completions.create({ 
        messages: [
            {
                role: 'system',
                content: systemPrompt
            },
            ...data,
        ],
        model: 'gpt-4o-mini', 
        stream: true    
    });

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();
            try {
                for await (const chunk of completion) {  
                    const content = chunk.choices[0]?.delta.content;
                    if (content) {
                        const text = encoder.encode(content);
                        controller.enqueue(text);
                    }
                }
            } catch (error) {
                controller.error(error);  
            } finally {
                controller.close();
            }
        }  
    });

    return new NextResponse(stream);
}
