import { WebClient } from '@slack/web-api';

// Function to create Slack API client
export const createSlackClient = (token: string) => {
  return new WebClient(token);
};

// Parse Slack message
export const parseSlackMessage = (message: any, channelInfo: any = {}) => {
  return {
    id: message.ts,
    channelId: message.channel,
    channelName: channelInfo.name || 'Unknown Channel',
    userId: message.user,
    text: message.text,
    date: new Date(parseFloat(message.ts) * 1000), // Convert Slack timestamp to Date
    threadId: message.thread_ts || message.ts,
    reactions: message.reactions || [],
    files: message.files || [],
    source: 'slack',
  };
};

// Fetch messages from Slack
export const fetchSlackMessages = async (token: string, limit = 10) => {
  try {
    const client = createSlackClient(token);
    
    // Get list of channels
    const channelsResponse = await client.conversations.list({
      types: 'public_channel,private_channel',
      exclude_archived: true,
      limit: 100,
    });
    
    if (!channelsResponse.channels || channelsResponse.channels.length === 0) {
      return [];
    }
    
    // Get messages from each channel
    const allMessages: any[] = [];
    const channelsMap = new Map();
    
    // Build a map of channel IDs to channel info for quicker lookups
    channelsResponse.channels.forEach((channel: any) => {
      if (channel.id) {
        channelsMap.set(channel.id, {
          name: channel.name,
          is_private: channel.is_private,
        });
      }
    });
    
    // Get messages from recent channels (limit to 5 channels to avoid rate limiting)
    const channels = channelsResponse.channels.slice(0, 5);
    
    // Fetch messages from all channels in parallel
    await Promise.all(
      channels.map(async (channel: any) => {
        if (!channel.id) return;
        
        try {
          const historyResponse = await client.conversations.history({
            channel: channel.id,
            limit: Math.ceil(limit / channels.length), // Distribute the limit across channels
          });
          
          if (historyResponse.messages && historyResponse.messages.length > 0) {
            const channelMessages = historyResponse.messages.map((message: any) => 
              parseSlackMessage(
                { ...message, channel: channel.id },
                channelsMap.get(channel.id)
              )
            );
            allMessages.push(...channelMessages);
          }
        } catch (error) {
          console.error(`Error fetching messages from channel ${channel.id}:`, error);
        }
      })
    );
    
    // Sort messages by date (newest first)
    return allMessages
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching Slack messages:', error);
    throw new Error('Failed to fetch Slack messages');
  }
};

// Get Slack OAuth URL
export const getSlackOAuthUrl = (clientId: string, redirectUri: string) => {
  const scopes = [
    'channels:history',
    'channels:read',
    'chat:write',
    'groups:history',
    'groups:read',
    'users:read',
  ].join(',');
  
  return `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}`;
};