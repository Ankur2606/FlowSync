import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { fetchEmails } from '@/lib/integrations/gmail';

// GET handler to fetch emails
export async function GET(request: NextRequest) {
  try {
    // Get session and check if user is authenticated
    const session = await getServerSession();
    
    if (!session || !session.accessToken) {
      return NextResponse.json(
        { error: 'You must be signed in to access emails' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Fetch emails using Gmail API
    const emails = await fetchEmails(session.accessToken, limit);
    
    return NextResponse.json({ emails });
  } catch (error) {
    console.error('Error in email API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch emails' },
      { status: 500 }
    );
  }
}