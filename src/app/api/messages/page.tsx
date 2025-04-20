"use client";

import { useState, useEffect } from "react";
import { MessageCard } from "@/components/messages/MessageCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessagePriority } from "@/lib/analysis/message-analysis";
import { motion } from "framer-motion";

// Mock data for development
const mockMessages = [
  {
    id: "msg1",
    subject: "Project Deadline Reminder",
    from: "Alex Johnson <alex@company.com>",
    date: new Date(),
    snippet: "Just a reminder that the project deadline is tomorrow. Please make sure to submit your work by 5 PM.",
    body: "Hi there,\n\nJust a reminder that the project deadline is tomorrow. Please make sure to submit your work by 5 PM.\n\nBest regards,\nAlex",
    source: "gmail",
  },
  {
    id: "msg2",
    channelName: "general",
    userId: "U123456",
    text: "Team meeting at 2 PM today to discuss the quarterly goals. Please prepare your updates.",
    date: new Date(),
    source: "slack",
  },
  {
    id: "msg3",
    subject: "Weekly Newsletter",
    from: "Marketing Team <marketing@company.com>",
    date: new Date(),
    snippet: "Check out the latest company updates in our weekly newsletter.",
    body: "Hello Team,\n\nHere's our weekly newsletter with company updates and announcements.\n\n- New client onboarding next week\n- Office maintenance on Friday\n- Team lunch on Wednesday\n\nRegards,\nMarketing Team",
    source: "gmail",
  },
];

// Mock analysis results
const mockAnalysis = {
  msg1: {
    priority: MessagePriority.CRITICAL,
    summary: "Urgent reminder about project deadline tomorrow at 5 PM.",
    actionItems: ["Submit project work by 5 PM tomorrow", "Send confirmation email after submission"],
    tags: ["deadline", "project", "urgent"],
  },
  msg2: {
    priority: MessagePriority.ACTION,
    summary: "Team meeting scheduled for 2 PM today to discuss quarterly goals.",
    actionItems: ["Prepare department updates for the meeting", "Join meeting at 2 PM"],
    tags: ["meeting", "quarterly-goals"],
  },
  msg3: {
    priority: MessagePriority.INFO,
    summary: "Weekly company newsletter with updates on new clients, office maintenance, and team lunch.",
    actionItems: [],
    tags: ["newsletter", "announcements"],
  },
};

export default function MessagesPage() {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState(mockMessages);
  const [analysisResults, setAnalysisResults] = useState(mockAnalysis);
  const [activeFilter, setActiveFilter] = useState<MessagePriority | "all">("all");

  // Simulate loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Filter messages by priority
  const filteredMessages = messages.filter((message) => {
    if (activeFilter === "all") return true;
    const analysis = analysisResults[message.id];
    return analysis && analysis.priority === activeFilter;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">Messages</h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-1">
              Your prioritized emails and Slack messages
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setActiveFilter("all")}
              className={activeFilter === "all" ? "bg-neutral-100 dark:bg-neutral-800" : ""}
            >
              All
            </Button>
            <Button
              variant="outline"
              onClick={() => setActiveFilter(MessagePriority.CRITICAL)}
              className={activeFilter === MessagePriority.CRITICAL ? "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800/30" : ""}
            >
              <span className="mr-1">🔴</span> Critical
            </Button>
            <Button
              variant="outline"
              onClick={() => setActiveFilter(MessagePriority.ACTION)}
              className={activeFilter === MessagePriority.ACTION ? "bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800/30" : ""}
            >
              <span className="mr-1">🟠</span> Action
            </Button>
            <Button
              variant="outline"
              onClick={() => setActiveFilter(MessagePriority.INFO)}
              className={activeFilter === MessagePriority.INFO ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800/30" : ""}
            >
              <span className="mr-1">🟢</span> Info
            </Button>
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          {loading ? (
            // Loading state
            <div className="flex flex-col space-y-4">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  className="border rounded-lg p-6 w-full h-40 animate-pulse bg-neutral-100 dark:bg-neutral-800"
                />
              ))}
            </div>
          ) : filteredMessages.length === 0 ? (
            // No messages state
            <div className="text-center py-20 border rounded-lg">
              <h3 className="text-xl font-semibold">No messages found</h3>
              <p className="text-neutral-500 dark:text-neutral-400 mt-1">
                Try changing your filter or check back later
              </p>
            </div>
          ) : (
            // Messages list with staggered animation
            <motion.div 
              className="flex flex-col space-y-4"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { 
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              {filteredMessages.map((message) => (
                <motion.div
                  key={message.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <MessageCard
                    message={message}
                    analysis={analysisResults[message.id]}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {Object.entries(MessagePriority).map(([key, value]) => {
            // Count messages in each priority
            const count = Object.values(analysisResults).filter(a => a.priority === value).length;
            
            const colorClasses = {
              [MessagePriority.CRITICAL]: "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/30",
              [MessagePriority.ACTION]: "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800/30",
              [MessagePriority.INFO]: "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800/30",
            };
            
            const emoji = {
              [MessagePriority.CRITICAL]: "🔴",
              [MessagePriority.ACTION]: "🟠",
              [MessagePriority.INFO]: "🟢",
            };
            
            return (
              <div 
                key={key} 
                className={`border rounded-lg p-4 ${colorClasses[value]}`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <span>{emoji[value]}</span> 
                      {key.charAt(0) + key.slice(1).toLowerCase()}
                    </h3>
                    <p className="text-neutral-500 dark:text-neutral-400">
                      {count} {count === 1 ? 'message' : 'messages'}
                    </p>
                  </div>
                  <div className="text-3xl font-bold">{count}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center mt-8">
          <Button>
            Refresh Messages
          </Button>
        </div>
      </div>
    </div>
  );
}