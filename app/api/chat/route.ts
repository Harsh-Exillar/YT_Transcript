import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Validate environment variables
if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in environment variables')
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { message, transcript } = await request.json()

    if (!message || !transcript) {
      return NextResponse.json({ error: 'Missing message or transcript' }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const transcriptText = Array.isArray(transcript) 
      ? transcript.map(item => item.text || item).join(' ')
      : transcript

    const prompt = `
Based on the following YouTube video transcript, please answer the user's question:

TRANSCRIPT:
${transcriptText}

USER QUESTION:
${message}

Please provide a helpful and accurate response based on the transcript content.
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ response: text })
  } catch (error: any) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate AI response' },
      { status: 500 }
    )
  }
}
