import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { MessagePriority } from '@/lib/analysis/message-analysis';

type BriefingCardProps = {
  briefing: {
    timestamp: Date;
    criticalMessages: any[];
    actionMessages: any[];
    upcomingTasks: any[];
    summary: string;
  };
  onGenerateAudio: (summary: string) => Promise<void>;
};

export function BriefingCard({ briefing, onGenerateAudio }: BriefingCardProps) {
  const [loading, setLoading] = useState(false);

  const handleAudioGeneration = async () => {
    setLoading(true);
    try {
      await onGenerateAudio(briefing.summary);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-600/10 to-blue-500/10 dark:from-purple-800/20 dark:to-blue-700/20">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-bold">Daily Briefing</CardTitle>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                Generated on {new Date(briefing.timestamp).toLocaleString()}
              </p>
            </div>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-none">
              New
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6 pb-2">
          <div className="space-y-4">
            {/* Summary Section */}
            <div className="bg-neutral-50 dark:bg-neutral-900/50 rounded-lg p-4 border border-neutral-200 dark:border-neutral-800">
              <h3 className="text-lg font-medium mb-2">Summary</h3>
              <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-line">
                {briefing.summary}
              </p>
            </div>
            
            {/* Stats Section */}
            <div className="grid grid-cols-3 gap-4">
              <StatCard 
                title="Critical" 
                count={briefing.criticalMessages.length} 
                emoji="🔴" 
                className="bg-red-50 dark:bg-red-900/20"
              />
              <StatCard 
                title="Action Needed" 
                count={briefing.actionMessages.length} 
                emoji="🟠" 
                className="bg-orange-50 dark:bg-orange-900/20"
              />
              <StatCard 
                title="Tasks" 
                count={briefing.upcomingTasks.length} 
                emoji="📝" 
                className="bg-blue-50 dark:bg-blue-900/20"
              />
            </div>
            
            {/* Messages Preview */}
            {(briefing.criticalMessages.length > 0 || briefing.actionMessages.length > 0) && (
              <div>
                <h3 className="text-lg font-medium mb-3">Important Messages</h3>
                <div className="space-y-2">
                  {briefing.criticalMessages.map(message => (
                    <MessagePreview 
                      key={message.id}
                      message={message}
                      priority="critical"
                    />
                  ))}
                  
                  {briefing.actionMessages.map(message => (
                    <MessagePreview 
                      key={message.id}
                      message={message}
                      priority="action"
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Tasks Preview */}
            {briefing.upcomingTasks.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-3">Upcoming Tasks</h3>
                <div className="space-y-2">
                  {briefing.upcomingTasks.map(task => (
                    <TaskPreview
                      key={task.id}
                      task={task}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="border-t border-neutral-200 dark:border-neutral-800 p-4 flex justify-between items-center">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Send this briefing to your devices
          </p>
          <Button 
            className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
            onClick={handleAudioGeneration}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Audio...
              </>
            ) : (
              <>
                <span className="mr-2">🔊</span>
                Send to Telegram
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

// Helper components
function StatCard({ 
  title, 
  count, 
  emoji, 
  className 
}: { 
  title: string; 
  count: number; 
  emoji: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 ${className}`}>
      <div className="text-2xl mr-3">{emoji}</div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xl font-bold">{count}</p>
      </div>
    </div>
  );
}

function MessagePreview({ message, priority }: { message: any; priority: string }) {
  const colors = {
    critical: "border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-900/20",
    action: "border-orange-400 dark:border-orange-600 bg-orange-50 dark:bg-orange-900/20",
    info: "border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-900/20",
  };

  const emojis = {
    critical: "🔴",
    action: "🟠",
    info: "🟢",
  };

  const sourceLabel = message.source === 'gmail' ? 'Email' : 'Slack';
  const title = message.source === 'gmail' ? message.subject : `#${message.channelName}`;

  return (
    <div className={`border-l-4 px-3 py-2 rounded-md ${colors[priority as keyof typeof colors]}`}>
      <div className="flex justify-between items-start">
        <p className="font-medium flex items-center">
          <span className="mr-2">{emojis[priority as keyof typeof emojis]}</span>
          {title}
        </p>
        <Badge variant="outline" className="text-xs">
          {sourceLabel}
        </Badge>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">
        {message.analysis.summary}
      </p>
    </div>
  );
}

function TaskPreview({ task }: { task: any }) {
  const priorityColors = {
    high: "border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-900/20",
    medium: "border-orange-400 dark:border-orange-600 bg-orange-50 dark:bg-orange-900/20",
    low: "border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-900/20",
  };
  
  const priorityEmojis = {
    high: "🔴",
    medium: "🟠",
    low: "🟢",
  };

  return (
    <div className={`border-l-4 px-3 py-2 rounded-md ${priorityColors[task.priority as keyof typeof priorityColors]}`}>
      <div className="flex justify-between items-start">
        <p className="font-medium flex items-center">
          <span className="mr-2">{priorityEmojis[task.priority as keyof typeof priorityEmojis]}</span>
          {task.title}
        </p>
        
        {task.dueDate && (
          <Badge variant="outline" className={`text-xs ${
            new Date(task.dueDate).toDateString() === new Date().toDateString() ? 
            'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300' : ''
          }`}>
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </Badge>
        )}
      </div>
      
      {task.description && (
        <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">
          {task.description}
        </p>
      )}
    </div>
  );
}