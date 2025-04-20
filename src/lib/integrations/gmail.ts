import { google } from 'googleapis';
import { getServerSession } from 'next-auth';

// Function to create Gmail API client
export const createGmailClient = async (accessToken: string) => {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: accessToken,
  });

  return google.gmail({ version: 'v1', auth: oauth2Client });
};

// Parse email content
export const parseEmailContent = (message: any) => {
  const payload = message.payload;
  const headers = payload.headers;

  const getHeaderValue = (name: string) => {
    const header = headers.find((h: any) => h.name.toLowerCase() === name.toLowerCase());
    return header ? header.value : '';
  };

  const from = getHeaderValue('from');
  const subject = getHeaderValue('subject');
  const date = getHeaderValue('date');

  let body = '';
  
  // Handle different message part types
  const extractBodyParts = (parts: any[]) => {
    parts.forEach((part) => {
      if (part.mimeType === 'text/plain' && part.body?.data) {
        body += Buffer.from(part.body.data, 'base64').toString();
      } else if (part.mimeType === 'text/html' && part.body?.data && body === '') {
        // Only use HTML if no plain text is available
        const html = Buffer.from(part.body.data, 'base64').toString();
        // Simple HTML to plain text conversion
        body = html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
      } else if (part.parts) {
        extractBodyParts(part.parts);
      }
    });
  };

  if (payload.parts) {
    extractBodyParts(payload.parts);
  } else if (payload.body?.data) {
    body = Buffer.from(payload.body.data, 'base64').toString();
  }

  return {
    id: message.id,
    threadId: message.threadId,
    from,
    subject,
    date: new Date(date),
    body,
    snippet: message.snippet || '',
    labelIds: message.labelIds || [],
    source: 'gmail',
  };
};

// Fetch emails from Gmail
export const fetchEmails = async (accessToken: string, maxResults = 10) => {
  try {
    const gmail = await createGmailClient(accessToken);
    
    // Get messages list
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults,
      q: 'in:inbox', // Only get inbox messages
    });

    if (!response.data.messages || response.data.messages.length === 0) {
      return [];
    }

    // Fetch full message details for each message ID
    const messages = await Promise.all(
      response.data.messages.map(async (message) => {
        const fullMessage = await gmail.users.messages.get({
          userId: 'me',
          id: message.id!,
          format: 'full',
        });
        return parseEmailContent(fullMessage.data);
      })
    );

    return messages;
  } catch (error) {
    console.error('Error fetching emails:', error);
    throw new Error('Failed to fetch emails');
  }
};