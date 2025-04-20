"use client";

import { useState, useEffect } from "react";
import { BriefingCard } from "@/components/briefing/BriefingCard";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// Mock data for development
const mockBriefings = [
  {
    id: "briefing1",
    title: "Morning Briefing",
    date: new Date(),
    summary: "3 high-priority messages from clients, 2 tasks due today, team meeting at 2pm",
    messageCount: 12,
    taskCount: 5,
    status: "ready",
  },
  {
    id: "briefing2",
    title: "Afternoon Briefing",
    date: new Date(Date.now() - 86400000), // Yesterday
    summary: "Weekly project updates, 1 urgent message from your manager, 3 completed tasks",
    messageCount: 8,
    taskCount: 3,
    status: "ready",
  },
  {
    id: "briefing3",
    title: "Weekly Overview",
    date: new Date(Date.now() - 86400000 * 7), // A week ago
    summary: "Project deadlines for next week, team performance metrics, upcoming client meetings",
    messageCount: 25,
    taskCount: 12,
    status: "archived",
  }
];

export default function BriefingsPage() {
  const [loading, setLoading] = useState(true);
  const [briefings, setBriefings] = useState(mockBriefings);
  const [filter, setFilter] = useState("all");
  
  // Simulate loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter briefings
  const filteredBriefings = briefings.filter((briefing) => {
    if (filter === "all") return true;
    return briefing.status === filter;
  });

  return (
    <div className="py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">Briefings</h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-1">
              Daily and weekly summaries of your activity
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setFilter("all")}
              className={filter === "all" ? "bg-neutral-100 dark:bg-neutral-800" : ""}
            >
              All
            </Button>
            <Button
              variant="outline"
              onClick={() => setFilter("ready")}
              className={filter === "ready" ? "bg-blue-50 dark:bg-blue-950/20" : ""}
            >
              Ready
            </Button>
            <Button
              variant="outline"
              onClick={() => setFilter("archived")}
              className={filter === "archived" ? "bg-neutral-200 dark:bg-neutral-700" : ""}
            >
              Archived
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            // Loading state
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div 
                  key={i} 
                  className="border rounded-lg p-6 h-52 animate-pulse bg-neutral-100 dark:bg-neutral-800"
                />
              ))}
            </div>
          ) : filteredBriefings.length === 0 ? (
            // No briefings state
            <div className="text-center py-20 border rounded-lg">
              <h3 className="text-xl font-semibold">No briefings found</h3>
              <p className="text-neutral-500 dark:text-neutral-400 mt-1">
                Try changing your filter or check back later
              </p>
            </div>
          ) : (
            // Briefings grid with staggered animation
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
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
              {filteredBriefings.map((briefing) => (
                <motion.div
                  key={briefing.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <BriefingCard briefing={briefing} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
        
        <div className="flex justify-center mt-8">
          <Button>
            Generate New Briefing
          </Button>
        </div>
      </div>
    </div>
  );
}