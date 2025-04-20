import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { MessagePriority } from '@/lib/analysis/message-analysis';

export async function GET(request: NextRequest) {
  try {
    // In a real app, these would be fetched from actual API endpoints
    const mockMessages = [
      {
        id: "msg1",
        subject: "Project Deadline Reminder",
        from: "Alex Johnson <alex@company.com>",
        date: new Date(),
        snippet: "Just a reminder that the project deadline is tomorrow. Please make sure to submit your work by 5 PM.",
        source: "gmail",
        analysis: {
          priority: MessagePriority.CRITICAL,
          summary: "Urgent reminder about project deadline tomorrow at 5 PM.",
          actionItems: ["Submit project work by 5 PM tomorrow", "Send confirmation email after submission"],
          tags: ["deadline", "project", "urgent"],
        }
      },
      {
        id: "msg2",
        channelName: "general",
        userId: "U123456",
        text: "Team meeting at 2 PM today to discuss the quarterly goals. Please prepare your updates.",
        date: new Date(),
        source: "slack",
        analysis: {
          priority: MessagePriority.ACTION,
          summary: "Team meeting scheduled for 2 PM today to discuss quarterly goals.",
          actionItems: ["Prepare department updates for the meeting", "Join meeting at 2 PM"],
          tags: ["meeting", "quarterly-goals"],
        }
      },
      {
        id: "msg3",
        subject: "Weekly Newsletter",
        from: "Marketing Team <marketing@company.com>",
        date: new Date(),
        snippet: "Check out the latest company updates in our weekly newsletter.",
        source: "gmail",
        analysis: {
          priority: MessagePriority.INFO,
          summary: "Weekly company newsletter with updates on new clients, office maintenance, and team lunch.",
          actionItems: [],
          tags: ["newsletter", "announcements"],
        }
      },
    ];

    const mockTasks = [
      {
        id: "task1",
        title: "Submit project work by 5 PM tomorrow",
        description: "Ensure all deliverables are included in the final package and notify team when complete.",
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        priority: "high",
        source: {
          type: "gmail",
          title: "Project Deadline Reminder",
          id: "msg1"
        },
        tags: ["deadline", "project", "urgent"],
        completed: false
      },
      {
        id: "task2",
        title: "Prepare department updates for the meeting",
        dueDate: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
        priority: "medium",
        source: {
          type: "slack",
          title: "#general",
          id: "msg2"
        },
        tags: ["meeting", "quarterly-goals"],
        completed: false
      }
    ];

    // Generate a briefing using Gemini API (in production)
    // Here we're just constructing a structured summary directly
    
    const briefing = {
      timestamp: new Date(),
      criticalMessages: mockMessages.filter(msg => msg.analysis.priority === MessagePriority.CRITICAL),
      actionMessages: mockMessages.filter(msg => msg.analysis.priority === MessagePriority.ACTION),
      upcomingTasks: mockTasks.filter(task => !task.completed),
      summary: generateBriefingSummary(mockMessages, mockTasks)
    };

    return NextResponse.json({ briefing });
  } catch (error) {
    console.error('Error generating briefing:', error);
    return NextResponse.json(
      { error: 'Failed to generate briefing' },
      { status: 500 }
    );
  }
}

// POST endpoint for generating audio briefings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if text is provided for voice conversion
    if (!body.text) {
      return NextResponse.json(
        { error: 'Briefing text is required for audio conversion' },
        { status: 400 }
      );
    }

    // In a real app, we would use ElevenLabs API to convert text to speech
    // and then send it to Telegram via the Telegram Bot API
    
    // Mock successful response
    return NextResponse.json({
      success: true,
      message: "Audio briefing generated and sent to Telegram",
      telegramMessageId: "mock_telegram_msg_" + Date.now()
    });
  } catch (error) {
    console.error('Error creating audio briefing:', error);
    return NextResponse.json(
      { error: 'Failed to generate audio briefing' },
      { status: 500 }
    );
  }
}

// Helper function to generate a human-readable briefing
function generateBriefingSummary(messages: any[], tasks: any[]): string {
  const criticalCount = messages.filter(msg => msg.analysis.priority === MessagePriority.CRITICAL).length;
  const actionCount = messages.filter(msg => msg.analysis.priority === MessagePriority.ACTION).length;
  const dueTodayCount = tasks.filter(task => 
    task.dueDate && 
    new Date(task.dueDate).toDateString() === new Date().toDateString() && 
    !task.completed
  ).length;
  
  let summary = `Good morning! Here's your daily briefing for ${new Date().toLocaleDateString()}.\n\n`;
  
  if (criticalCount > 0) {
    summary += `You have ${criticalCount} critical message${criticalCount !== 1 ? 's' : ''} requiring immediate attention.\n`;
  }
  
  if (actionCount > 0) {
    summary += `There ${actionCount !== 1 ? 'are' : 'is'} ${actionCount} message${actionCount !== 1 ? 's' : ''} that require action.\n`;
  }
  
  if (dueTodayCount > 0) {
    summary += `You have ${dueTodayCount} task${dueTodayCount !== 1 ? 's' : ''} due today.\n`;
  }
  
  // Add most urgent task if available
  const urgentTasks = tasks.filter(t => t.priority === "high" && !t.completed);
  if (urgentTasks.length > 0) {
    summary += `\nMost urgent task: ${urgentTasks[0].title}\n`;
  }
  
  summary += `\nHave a productive day!`;
  
  return summary;
}