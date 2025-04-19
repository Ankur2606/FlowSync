import axios from 'axios';

// Message priority levels
export enum MessagePriority {
  CRITICAL = 'critical', // 🔴
  ACTION = 'action',     // 🟠
  INFO = 'info',         // 🟢
}

// Message analysis result type
export type MessageAnalysis = {
  priority: MessagePriority;
  summary: string;
  actionItems: string[];
  tags: string[];
};

// Generate prompt for Gemini API
const generateAnalysisPrompt = (message: any) => {
  let content = '';
  let source = '';
  
  // Format based on message source
  if (message.source === 'gmail') {
    source = 'Email';
    content = `
Subject: ${message.subject}
From: ${message.from}
Date: ${message.date}
Body: ${message.body || message.snippet}
    `.trim();
  } else if (message.source === 'slack') {
    source = 'Slack message';
    content = `
Channel: ${message.channelName}
Date: ${message.date}
Message: ${message.text}
    `.trim();
  } else {
    source = 'Message';
    content = JSON.stringify(message);
  }

  return `
You are an AI assistant analyzing a ${source} to determine its priority and action items.

${source} content:
${content}

Analyze this ${source} and respond only with a valid JSON object in the following format:
{
  "priority": "critical" | "action" | "info",
  "summary": "Brief 1-2 sentence summary of the content",
  "actionItems": ["List of specific actions to take based on the content", "..."],
  "tags": ["Relevant topic tags", "..."]
}

Priority levels:
- critical: Urgent matters requiring immediate attention (deadlines within 24 hours, emergencies, critical issues)
- action: Items requiring a response or action but not urgent (tasks, questions, important information)
- info: Informational content requiring no immediate action (newsletters, updates, FYI messages)

Ensure the summary captures the essence of the message. Extract concrete, actionable tasks into the actionItems array. Identify 1-5 relevant tags.
`.trim();
};

// Analyze a message using Gemini API
export async function analyzeMessage(message: any): Promise<MessageAnalysis> {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  
  if (!geminiApiKey) {
    throw new Error('Gemini API key not configured');
  }

  try {
    const prompt = generateAnalysisPrompt(message);
    
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 800,
        }
      }
    );

    // Extract JSON from response
    const textContent = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Parse JSON from response (may need to extract JSON if there's extra text)
    let jsonMatch = textContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from Gemini API response');
    }
    
    const analysisResult = JSON.parse(jsonMatch[0]);
    
    // Validate and normalize the result
    return {
      priority: validatePriority(analysisResult.priority),
      summary: analysisResult.summary || 'No summary available',
      actionItems: Array.isArray(analysisResult.actionItems) ? analysisResult.actionItems : [],
      tags: Array.isArray(analysisResult.tags) ? analysisResult.tags : [],
    };
  } catch (error) {
    console.error('Error analyzing message:', error);
    
    // Return default analysis in case of error
    return {
      priority: MessagePriority.INFO,
      summary: 'Failed to analyze the message',
      actionItems: [],
      tags: ['error'],
    };
  }
}

// Ensure priority is a valid enum value
function validatePriority(priority: string): MessagePriority {
  switch (priority?.toLowerCase()) {
    case 'critical':
      return MessagePriority.CRITICAL;
    case 'action':
      return MessagePriority.ACTION;
    case 'info':
      return MessagePriority.INFO;
    default:
      return MessagePriority.INFO; // Default to INFO if invalid
  }
}

// Get emoji for priority level
export function getPriorityEmoji(priority: MessagePriority): string {
  switch (priority) {
    case MessagePriority.CRITICAL:
      return '🔴';
    case MessagePriority.ACTION:
      return '🟠';
    case MessagePriority.INFO:
      return '🟢';
    default:
      return '⚪';
  }
}

// Batch analyze multiple messages
export async function batchAnalyzeMessages(messages: any[]): Promise<Record<string, MessageAnalysis>> {
  const analysisMap: Record<string, MessageAnalysis> = {};
  
  // Process messages sequentially to avoid rate limiting
  for (const message of messages) {
    const messageId = message.id || `${message.source}-${Date.now()}-${Math.random()}`;
    try {
      analysisMap[messageId] = await analyzeMessage(message);
    } catch (error) {
      console.error(`Error analyzing message ${messageId}:`, error);
      // Use default analysis for failed messages
      analysisMap[messageId] = {
        priority: MessagePriority.INFO,
        summary: 'Failed to analyze the message',
        actionItems: [],
        tags: ['error'],
      };
    }
    // Add delay to avoid hitting rate limits
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  return analysisMap;
}