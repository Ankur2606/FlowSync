import { NextRequest, NextResponse } from 'next/server';
import { analyzeMessage, batchAnalyzeMessages } from '@/lib/analysis/message-analysis';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Check if we have a single message or batch of messages
    if (Array.isArray(body.messages)) {
      // Batch analysis
      const messages = body.messages;
      if (!messages.length) {
        return NextResponse.json(
          { error: 'No messages provided for analysis' },
          { status: 400 }
        );
      }
      
      const analysisResults = await batchAnalyzeMessages(messages);
      return NextResponse.json({ analysis: analysisResults });
    } else if (body.message) {
      // Single message analysis
      const message = body.message;
      const analysis = await analyzeMessage(message);
      return NextResponse.json({ analysis });
    } else {
      return NextResponse.json(
        { error: 'Invalid request body. Expected "message" or "messages" field.' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error in analyze API route:', error);
    return NextResponse.json(
      { error: 'Failed to analyze message(s)' },
      { status: 500 }
    );
  }
}