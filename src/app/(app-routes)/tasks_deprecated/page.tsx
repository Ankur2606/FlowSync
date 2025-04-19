"use client";

import { useState, useEffect } from "react";
import { TaskCard } from "@/components/tasks/TaskCard";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// Mock data for development
const mockTasks = [
  {
    id: "task1",
    title: "Review quarterly report",
    description: "Go through the Q2 financial report and provide feedback",
    dueDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
    status: "pending",
    priority: "high",
    source: {
      type: "email",
      id: "msg1",
      from: "Alex Johnson <alex@company.com>",
    }
  },
  {
    id: "task2",
    title: "Prepare presentation for team meeting",
    description: "Create slides for the 2 PM meeting about quarterly goals",
    dueDate: new Date(Date.now() + 86400000), // 1 day from now
    status: "in-progress",
    priority: "medium",
    source: {
      type: "slack",
      id: "msg2",
      channel: "general",
    }
  },
  {
    id: "task3",
    title: "RSVP to team lunch",
    description: "Confirm attendance for Wednesday's team lunch",
    dueDate: new Date(Date.now() + 86400000 * 3), // 3 days from now
    status: "pending",
    priority: "low",
    source: {
      type: "email",
      id: "msg3",
      from: "Marketing Team <marketing@company.com>",
    }
  }
];

export default function TasksPage() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState(mockTasks);
  const [filter, setFilter] = useState("all");
  
  // Simulate loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter tasks by status
  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    return task.status === filter;
  });

  const changeTaskStatus = (id: string, status: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status } : task
    ));
  };

  return (
    <div className="py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">Tasks</h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-1">
              Manage your tasks extracted from messages
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
              onClick={() => setFilter("pending")}
              className={filter === "pending" ? "bg-blue-50 dark:bg-blue-950/20" : ""}
            >
              Pending
            </Button>
            <Button
              variant="outline"
              onClick={() => setFilter("in-progress")}
              className={filter === "in-progress" ? "bg-amber-50 dark:bg-amber-950/20" : ""}
            >
              In Progress
            </Button>
            <Button
              variant="outline"
              onClick={() => setFilter("completed")}
              className={filter === "completed" ? "bg-green-50 dark:bg-green-950/20" : ""}
            >
              Completed
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            // Loading state
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  className="border rounded-lg p-6 h-40 animate-pulse bg-neutral-100 dark:bg-neutral-800"
                />
              ))}
            </div>
          ) : filteredTasks.length === 0 ? (
            // No tasks state
            <div className="text-center py-20 border rounded-lg">
              <h3 className="text-xl font-semibold">No tasks found</h3>
              <p className="text-neutral-500 dark:text-neutral-400 mt-1">
                Try changing your filter or check back later
              </p>
            </div>
          ) : (
            // Tasks grid with staggered animation
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
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
              {filteredTasks.map((task) => (
                <motion.div
                  key={task.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <TaskCard
                    task={task}
                    onStatusChange={(status) => changeTaskStatus(task.id, status)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Task Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium">Pending</h3>
            <p className="text-3xl font-bold mt-2">
              {tasks.filter(t => t.status === "pending").length}
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium">In Progress</h3>
            <p className="text-3xl font-bold mt-2">
              {tasks.filter(t => t.status === "in-progress").length}
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium">Completed</h3>
            <p className="text-3xl font-bold mt-2">
              {tasks.filter(t => t.status === "completed").length}
            </p>
          </div>
        </div>
        
        <div className="flex justify-center mt-8">
          <Button>
            Refresh Tasks
          </Button>
        </div>
      </div>
    </div>
  );
}