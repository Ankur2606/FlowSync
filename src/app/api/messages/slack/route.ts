import { NextRequest, NextResponse } from 'next/server';
import { fetchSlackMessages } from '@/lib/integrations/slack';

// GET handler to fetch Slack messages
export async function GET(request: NextRequest) {
  try {
    // Get Slack token from cookies or session storage
    // In a real app, you'd store this securely after OAuth
    const cookies = request.cookies;
    const slackToken = cookies.get('slack_token')?.value;

    if (!slackToken) {
      return NextResponse.json(
        { error: 'Slack authentication required' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');

    // Fetch messages from Slack
    const messages = await fetchSlackMessages(slackToken, limit);

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error in Slack messages API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Slack messages' },
      { status: 500 }
    );
  }
}