"use client";

import { useState, useEffect } from "react";
import { TaskCard } from "@/components/tasks/TaskCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

// Mock tasks data for development
const mockTasks = [
  {
    id: "task1",
    title: "Submit project work by 5 PM tomorrow",
    description: "Ensure all deliverables are included in the final package and notify team when complete.",
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    priority: "high" as const,
    source: {
      type: "gmail" as const,
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
    priority: "medium" as const,
    source: {
      type: "slack" as const,
      title: "#general",
      id: "msg2"
    },
    tags: ["meeting", "quarterly-goals"],
    completed: false
  },
  {
    id: "task3",
    title: "Join team meeting at 2 PM",
    priority: "medium" as const,
    source: {
      type: "slack" as const,
      title: "#general",
      id: "msg2"
    },
    tags: ["meeting"],
    completed: false
  },
  {
    id: "task4",
    title: "Review weekly newsletter",
    description: "Take note of the office maintenance on Friday and team lunch on Wednesday.",
    priority: "low" as const,
    source: {
      type: "gmail" as const,
      title: "Weekly Newsletter",
      id: "msg3"
    },
    tags: ["newsletter", "announcements"],
    completed: true
  },
];

export default function TasksPage() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState(mockTasks);
  const [activeFilter, setActiveFilter] = useState<"all" | "pending" | "completed">("pending");

  // Simulate loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Filter tasks based on active filter
  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "pending") return !task.completed;
    return task.completed;
  });

  // Task completion handler
  const handleTaskStatusChange = (id: string, completed: boolean) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed } : task
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">Tasks</h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-1">
              Action items extracted from your messages
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
              onClick={() => setActiveFilter("pending")}
              className={activeFilter === "pending" ? "bg-neutral-100 dark:bg-neutral-800" : ""}
            >
              Pending
            </Button>
            <Button
              variant="outline"
              onClick={() => setActiveFilter("completed")}
              className={activeFilter === "completed" ? "bg-neutral-100 dark:bg-neutral-800" : ""}
            >
              Completed
            </Button>
          </div>
        </div>

        {/* Priority sections */}
        {!loading && (
          <>
            {/* High Priority */}
            <TaskSection
              title="High Priority"
              emoji="🔴"
              tasks={filteredTasks.filter(t => t.priority === "high")}
              onStatusChange={handleTaskStatusChange}
              loading={loading}
            />
            
            {/* Medium Priority */}
            <TaskSection
              title="Medium Priority"
              emoji="🟠"
              tasks={filteredTasks.filter(t => t.priority === "medium")}
              onStatusChange={handleTaskStatusChange}
              loading={loading}
            />
            
            {/* Low Priority */}
            <TaskSection
              title="Low Priority"
              emoji="🟢"
              tasks={filteredTasks.filter(t => t.priority === "low")}
              onStatusChange={handleTaskStatusChange}
              loading={loading}
            />
          </>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            <div className="h-8 w-40 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse"></div>
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className="border rounded-lg p-6 w-full h-32 animate-pulse bg-neutral-100 dark:bg-neutral-800"
              ></div>
            ))}
          </div>
        )}

        {/* No Tasks State */}
        {!loading && filteredTasks.length === 0 && (
          <div className="text-center py-20 border rounded-lg">
            <h3 className="text-xl font-semibold">No tasks found</h3>
            <p className="text-neutral-500 dark:text-neutral-400 mt-1">
              {activeFilter === "completed" 
                ? "You haven't completed any tasks yet" 
                : activeFilter === "pending"
                ? "All tasks are completed! Great job!"
                : "No tasks to display"}
            </p>
            {activeFilter !== "all" && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setActiveFilter("all")}
              >
                View all tasks
              </Button>
            )}
          </div>
        )}

        <div className="flex justify-center gap-2 mt-8">
          <Button>
            Refresh Tasks
          </Button>
          <Button variant="outline">
            Add Custom Task
          </Button>
        </div>
      </div>
    </div>
  );
}

// Task Section Component
function TaskSection({ 
  title, 
  emoji, 
  tasks, 
  onStatusChange,
  loading
}: { 
  title: string;
  emoji: string;
  tasks: any[];
  onStatusChange: (id: string, completed: boolean) => void;
  loading: boolean;
}) {
  if (tasks.length === 0) return null;
  
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">{emoji} {title}</h2>
        <Badge>{tasks.length}</Badge>
      </div>
      <motion.div 
        className="grid grid-cols-1 gap-3"
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
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <TaskCard task={task} onStatusChange={onStatusChange} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}