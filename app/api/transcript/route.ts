import { NextRequest, NextResponse } from 'next/server'

// Validate environment variables
if (!process.env.RAPIDAPI_KEY) {
  throw new Error('RAPIDAPI_KEY is not set in environment variables')
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'YouTube URL is required' }, { status: 400 })
    }

    // Extract video ID from YouTube URL
    const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    if (!videoIdMatch) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 })
    }

    const videoId = videoIdMatch[1]

    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': 'youtube-transcript3.p.rapidapi.com'
      }
    }

    const response = await fetch(
      `https://youtube-transcript3.p.rapidapi.com/youtubetranscript?video_id=${videoId}`,
      options
    )

    if (!response.ok) {
      throw new Error(`RapidAPI request failed: ${response.status}`)
    }

    const data = await response.json()

    if (!data || !data.transcript) {
      throw new Error('No transcript found for this video')
    }

    return NextResponse.json({
      transcript: data.transcript,
      title: data.title || 'YouTube Video'
    })
  } catch (error: any) {
    console.error('Transcript API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch transcript' },
      { status: 500 }
    )
  }
}
