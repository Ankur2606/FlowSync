import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessagePriority, getPriorityEmoji } from '@/lib/analysis/message-analysis';
import { motion } from "framer-motion";
import { cn } from '@/lib/utils';
import Link from 'next/link';

type MessageCardProps = {
  message: any;
  analysis: {
    priority: MessagePriority;
    summary: string;
    actionItems: string[];
    tags: string[];
  };
};

export function MessageCard({ message, analysis }: MessageCardProps) {
  const priorityEmoji = getPriorityEmoji(analysis.priority);
  const [expanded, setExpanded] = useState(false);
  
  // Configure styling based on priority
  const priorityStyles = {
    [MessagePriority.CRITICAL]: {
      border: 'border-l-4 border-l-red-500',
      background: 'bg-gradient-to-br from-white to-red-50 dark:from-neutral-900 dark:to-red-950/20',
      glowEffect: 'shadow-[0_0_15px_rgba(239,68,68,0.2)]',
      badgeBg: 'bg-red-50/80 text-red-700 dark:bg-red-900/30 dark:text-red-300',
      actionButton: 'bg-red-500 hover:bg-red-600 text-white',
    },
    [MessagePriority.ACTION]: {
      border: 'border-l-4 border-l-orange-400',
      background: 'bg-gradient-to-br from-white to-orange-50 dark:from-neutral-900 dark:to-orange-950/20',
      glowEffect: '',
      badgeBg: 'bg-orange-50/80 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
      actionButton: 'bg-orange-400 hover:bg-orange-500 text-white',
    },
    [MessagePriority.INFO]: {
      border: 'border-l-4 border-l-green-400',
      background: 'bg-gradient-to-br from-white to-green-50 dark:from-neutral-900 dark:to-green-950/20',
      glowEffect: '',
      badgeBg: 'bg-green-50/80 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      actionButton: 'bg-green-400 hover:bg-green-500 text-white',
    }
  };
  
  const styles = priorityStyles[analysis.priority];
  
  // Determine message display content based on source
  const getMessageTitle = () => {
    if (message.source === 'gmail') {
      return message.subject || 'No Subject';
    }
    return message.channelName ? `#${message.channelName}` : 'Message';
  };
  
  const getMessageSender = () => {
    if (message.source === 'gmail') {
      // Extract just the name part from a typical email format "Name <email@example.com>"
      const fromMatch = message.from?.match(/(.*?)\s*<.*>/) || [];
      return fromMatch[1] || message.from || 'Unknown Sender';
    }
    return message.userId || 'Unknown User';
  };
  
  const getMessageDate = () => {
    try {
      const date = new Date(message.date);
      return date.toLocaleString();
    } catch (e) {
      return 'Unknown Date';
    }
  };

  const sourceIcons = {
    gmail: (
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" />
      </svg>
    ),
    slack: (
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 15C4.9 15 4 14.1 4 13C4 11.9 4.9 11 6 11C7.1 11 8 11.9 8 13V15H6ZM6 9C4.9 9 4 8.1 4 7C4 5.9 4.9 5 6 5C7.1 5 8 5.9 8 7C8 8.1 7.1 9 6 9ZM12 15C10.9 15 10 14.1 10 13C10 11.9 10.9 11 12 11C13.1 11 14 11.9 14 13C14 14.1 13.1 15 12 15ZM12 9C10.9 9 10 8.1 10 7C10 5.9 10.9 5 12 5C13.1 5 14 5.9 14 7C14 8.1 13.1 9 12 9ZM18 15C16.9 15 16 14.1 16 13C16 11.9 16.9 11 18 11C19.1 11 20 11.9 20 13C20 14.1 19.1 15 18 15ZM18 9C16.9 9 16 8.1 16 7C16 5.9 16.9 5 18 5C19.1 5 20 5.9 20 7C20 8.1 19.1 9 18 9Z" />
      </svg>
    ),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ 
        scale: 1.01,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
      }}
      transition={{ duration: 0.2 }}
      className="w-full"
    >
      <Card className={cn(
        'transition-all overflow-hidden backdrop-blur-sm',
        'border dark:border-neutral-800',
        styles.border,
        styles.background,
        styles.glowEffect,
        'hover:shadow-xl dark:hover:shadow-neutral-900/40'
      )}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-700 dark:to-neutral-800">
                  {priorityEmoji}
                </div>
                <CardTitle className="text-lg font-semibold line-clamp-1">
                  {getMessageTitle()}
                </CardTitle>
              </div>
              <div className="flex items-center gap-1 mt-1 text-xs text-neutral-500">
                <span>{getMessageSender()}</span>
                <span>·</span>
                <span>{getMessageDate()}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {message.source === 'gmail' && (
                <Badge variant="outline" className={cn("flex gap-1 items-center text-xs py-0 h-6 px-2", "bg-blue-50/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300")}>
                  {sourceIcons.gmail}
                  <span>Email</span>
                </Badge>
              )}
              {message.source === 'slack' && (
                <Badge variant="outline" className={cn("flex gap-1 items-center text-xs py-0 h-6 px-2", "bg-purple-50/80 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300")}>
                  {sourceIcons.slack}
                  <span>Slack</span>
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pb-0 pt-2">
          <div className={cn(
            "rounded-md p-3",
            "bg-neutral-50/80 dark:bg-neutral-900/50",
            "border border-neutral-100 dark:border-neutral-800"
          )}>
            <p className="text-sm font-medium">{analysis.summary}</p>
            
            {analysis.actionItems.length > 0 && expanded && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3"
              >
                <h4 className="text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400 mb-1">Action Items:</h4>
                <ul className="text-xs space-y-1.5">
                  {analysis.actionItems.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-2 text-neutral-400 dark:text-neutral-500">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {analysis.actionItems.length > 0 && !expanded && (
              <button 
                onClick={() => setExpanded(true)}
                className="mt-2 text-xs font-medium text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 flex items-center"
              >
                Show {analysis.actionItems.length} action item{analysis.actionItems.length !== 1 ? 's' : ''} 
                <svg className="ml-1 w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between items-center pt-3 pb-3">
          <div className="flex flex-wrap gap-1">
            {analysis.tags.slice(0, 3).map((tag, i) => (
              <Badge key={i} variant="secondary" className="text-xs px-2 py-0 h-5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700">
                #{tag}
              </Badge>
            ))}
            {analysis.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs px-2 py-0 h-5 bg-neutral-100 dark:bg-neutral-800">
                +{analysis.tags.length - 3}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Link href={`/messages/${message.id}`} className="text-xs text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200">
              View details
            </Link>
            {analysis.priority === MessagePriority.CRITICAL && (
              <Button size="sm" className={cn("text-xs py-1 h-7", styles.actionButton)}>
                Take Action
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}