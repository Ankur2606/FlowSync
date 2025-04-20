"use client";

import { useState, useEffect } from "react";
import { BriefingCard } from "@/components/briefing/BriefingCard";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export default function BriefingsPage() {
  const [loading, setLoading] = useState(true);
  const [briefing, setBriefing] = useState<any>(null);
  const [audioGenerating, setAudioGenerating] = useState(false);
  const [audioSuccess, setAudioSuccess] = useState(false);

  // Fetch the briefing (simulated with a delay)
  useEffect(() => {
    const fetchBriefing = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        const response = await fetch('/api/briefing');
        const data = await response.json();
        setBriefing(data.briefing);
      } catch (error) {
        console.error("Failed to fetch briefing:", error);
      } finally {
        setLoading(false);
      }
    };

    // Simulate API call with a delay for demonstration
    const timer = setTimeout(() => {
      fetchBriefing();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Function to generate audio briefing
  const generateAudioBriefing = async (summary: string) => {
    try {
      setAudioGenerating(true);
      // In a real app, this would be an API call
      const response = await fetch('/api/briefing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: summary }),
      });
      
      const data = await response.json();
      if (data.success) {
        setAudioSuccess(true);
        // Reset success message after a few seconds
        setTimeout(() => setAudioSuccess(false), 5000);
      }
    } catch (error) {
      console.error("Failed to generate audio briefing:", error);
    } finally {
      setAudioGenerating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">Briefings</h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-1">
              Daily summaries of your important messages and tasks
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              onClick={() => {
                setLoading(true);
                // Simulate refreshing the briefing
                setTimeout(() => setLoading(false), 1500);
              }}
            >
              Refresh Briefing
            </Button>
          </div>
        </div>

        {/* Audio Success Alert */}
        {audioSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-50 border border-green-200 text-green-700 dark:bg-green-900/30 dark:border-green-800/30 dark:text-green-300 px-4 py-3 rounded flex justify-between items-center"
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              <p>Audio briefing successfully sent to Telegram!</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAudioSuccess(false)}
              className="h-8 w-8 p-0"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </Button>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            <div className="bg-neutral-100 dark:bg-neutral-800 h-12 w-1/3 rounded-lg animate-pulse"></div>
            <div className="bg-neutral-100 dark:bg-neutral-800 h-64 rounded-lg animate-pulse"></div>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-neutral-100 dark:bg-neutral-800 h-20 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        )}
        
        {/* No Briefing State */}
        {!loading && !briefing && (
          <Card className="p-8 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold mb-2">No briefing available</h2>
            <p className="text-neutral-500 dark:text-neutral-400 mb-6">
              We couldn't find any briefings for today. Try refreshing or check back later.
            </p>
            <Button onClick={() => {
              setLoading(true);
              // Simulate refreshing the briefing
              setTimeout(() => setLoading(false), 1500);
            }}>
              Generate Briefing
            </Button>
          </Card>
        )}

        {/* Briefing Display */}
        {!loading && briefing && (
          <BriefingCard 
            briefing={briefing} 
            onGenerateAudio={generateAudioBriefing} 
          />
        )}
        
        {/* Briefing Schedule Section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Briefing Schedule</h2>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Daily Morning Briefing</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  Delivered every day at 8:00 AM to your Telegram
                </p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline">
                  Edit Schedule
                </Button>
                <Button variant="outline" className="border-green-200 text-green-700 dark:border-green-800/30 dark:text-green-300">
                  Active
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}