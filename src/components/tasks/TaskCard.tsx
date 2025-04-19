import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from '@/lib/utils';
import Link from 'next/link';

type TaskCardProps = {
  task: {
    id: string;
    title: string;
    description?: string;
    dueDate?: Date;
    priority: 'high' | 'medium' | 'low';
    source: {
      type: 'gmail' | 'slack';
      title: string;
      id: string;
    };
    tags: string[];
    completed: boolean;
  };
  onStatusChange: (id: string, completed: boolean) => void;
};

export function TaskCard({ task, onStatusChange }: TaskCardProps) {
  const [isCompleted, setIsCompleted] = useState(task.completed);
  const [isHovered, setIsHovered] = useState(false);
  
  const priorityStyles = {
    high: {
      border: 'border-l-4 border-l-red-500',
      background: 'bg-gradient-to-br from-white to-red-50 dark:from-neutral-900 dark:to-red-950/20',
      badge: "bg-red-50/80 text-red-700 dark:bg-red-950/30 dark:text-red-300",
      icon: "text-red-500",
      emoji: "🔴"
    },
    medium: {
      border: 'border-l-4 border-l-orange-400',
      background: 'bg-gradient-to-br from-white to-orange-50 dark:from-neutral-900 dark:to-orange-950/20',
      badge: "bg-orange-50/80 text-orange-700 dark:bg-orange-950/30 dark:text-orange-300",
      icon: "text-orange-500",
      emoji: "🟠"
    },
    low: {
      border: 'border-l-4 border-l-green-400',
      background: 'bg-gradient-to-br from-white to-green-50 dark:from-neutral-900 dark:to-green-950/20',
      badge: "bg-green-50/80 text-green-700 dark:bg-green-950/30 dark:text-green-300",
      icon: "text-green-500",
      emoji: "🟢"
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

  const handleToggle = () => {
    const newStatus = !isCompleted;
    setIsCompleted(newStatus);
    onStatusChange(task.id, newStatus);
  };

  const isOverdue = task.dueDate && !isCompleted && new Date(task.dueDate) < new Date();

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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full"
    >
      <Card 
        className={cn(
          'transition-all overflow-hidden backdrop-blur-sm',
          'border dark:border-neutral-800',
          priorityStyles[task.priority].border,
          priorityStyles[task.priority].background,
          isCompleted && 'opacity-75',
          'hover:shadow-xl dark:hover:shadow-neutral-900/40'
        )}
      >
        <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-700 dark:to-neutral-800">
                {priorityStyles[task.priority].emoji}
              </div>
              <CardTitle className={cn(
                "text-lg font-semibold line-clamp-1",
                isCompleted && "line-through text-neutral-500 dark:text-neutral-400"
              )}>
                {task.title}
              </CardTitle>
            </div>
            
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className={cn("text-xs flex items-center gap-1", 
                task.source.type === 'gmail' 
                  ? "bg-blue-50/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  : "bg-purple-50/80 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
              )}>
                <span>{sourceIcons[task.source.type]}</span>
                <span>{task.source.title}</span>
              </Badge>
              
              <Badge variant="outline" className={cn("text-xs", priorityStyles[task.priority].badge)}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>
              
              {isOverdue && (
                <Badge className="text-xs bg-red-500 text-white dark:bg-red-500 dark:text-white">
                  Overdue
                </Badge>
              )}
            </div>
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleToggle}
            className={cn(
              "h-7 w-7 rounded-full transition-all",
              isCompleted 
                ? "bg-green-100 border-green-200 text-green-600 dark:bg-green-900/30 dark:border-green-800/30 dark:text-green-400"
                : (isHovered 
                  ? "bg-neutral-100 dark:bg-neutral-800" 
                  : "bg-white dark:bg-neutral-900"),
            )}
          >
            {isCompleted ? (
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                <path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-50">
                <path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
            )}
          </Button>
        </CardHeader>
        
        {task.description && (
          <CardContent className="pb-2 pt-0">
            <div className={cn(
              "rounded-md p-3 mt-2",
              "bg-neutral-50/80 dark:bg-neutral-900/50",
              "border border-neutral-100 dark:border-neutral-800"
            )}>
              <p className={cn(
                "text-sm text-neutral-600 dark:text-neutral-300",
                isCompleted && "text-neutral-500 dark:text-neutral-500"
              )}>
                {task.description}
              </p>
            </div>
          </CardContent>
        )}
        
        <CardFooter className="pt-2 flex justify-between items-center">
          <div className="flex flex-wrap gap-1">
            {task.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs px-2 py-0 h-5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700">
                #{tag}
              </Badge>
            ))}
            {task.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs px-2 py-0 h-5 bg-neutral-100 dark:bg-neutral-800">
                +{task.tags.length - 3}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {task.dueDate && (
              <div className={cn(
                "text-xs flex items-center",
                isCompleted 
                  ? "text-neutral-500 dark:text-neutral-500" 
                  : isOverdue
                    ? "text-red-600 dark:text-red-400" 
                    : "text-neutral-600 dark:text-neutral-400"
              )}>
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </div>
            )}
            
            <Link href={`/tasks/${task.id}`} className="text-xs text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 ml-2">
              Details
            </Link>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}