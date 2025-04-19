"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// Helper function to create gradient animations
const GradientBackground = ({ className }: { className?: string }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden -z-10 ${className}`}>
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-3/4 h-3/4 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-8 right-0 w-3/4 h-3/4 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 -left-20 w-3/4 h-3/4 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>
    </div>
  );
};

// Feature Card component with animation
const FeatureCard = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: string; 
  title: string; 
  description: string;
}) => {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      className="w-full"
    >
      <Card className="border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-950/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 rounded-full bg-neutral-100 dark:bg-neutral-900">
              <Image src={`/${icon}`} width={24} height={24} alt={title} />
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">{description}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-neutral-950/70 border-b border-neutral-200 dark:border-neutral-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                  FlowSync
                </span>
              </motion.div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-neutral-400 hover:text-neutral-500 dark:text-neutral-300 dark:hover:text-white"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className={`h-6 w-6 ${isMenuOpen ? 'hidden' : 'block'}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg
                  className={`h-6 w-6 ${isMenuOpen ? 'block' : 'hidden'}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Desktop nav links */}
            <div className="hidden md:flex md:items-center md:space-x-6">
              <Button variant="ghost" asChild>
                <Link href="/messages">Messages</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/tasks">Tasks</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/briefings">Briefings</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/settings">Settings</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-neutral-200 dark:border-neutral-800">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/messages">Messages</Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/tasks">Tasks</Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/briefings">Briefings</Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/settings">Settings</Link>
            </Button>
            <Button className="w-full" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 md:pt-32 md:pb-32 overflow-hidden">
        <GradientBackground />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 px-4 py-2 bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 border-none hover:bg-neutral-200 dark:hover:bg-neutral-800">
                Productivity Reinvented ✨
              </Badge>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold tracking-tight"
            >
              Stay in <span className="text-purple-500 dark:text-purple-400">Flow</span>, 
              <br />
              boost productivity
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 max-w-lg text-xl text-neutral-600 dark:text-neutral-300"
            >
              FlowSync integrates your emails and Slack messages with AI analysis to help you stay focused on what really matters.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row gap-4 w-full justify-center"
            >
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600" asChild>
                <Link href="/auth/signin">Get Started</Link>
              </Button>
              
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-neutral-50 dark:bg-neutral-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Smart Features for Smart Work</h2>
            <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300">
              Powerful tools to streamline your communication workflow
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon="file.svg"
              title="Smart Message Analysis"
              description="AI automatically prioritizes messages and extracts action items"
            />
            <FeatureCard
              icon="globe.svg"
              title="Cross-Platform Integration"
              description="Connect Gmail, Slack, and more for a unified experience"
            />
            <FeatureCard
              icon="window.svg"
              title="Voice Briefings"
              description="Get audio summaries of important messages via Telegram"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <GradientBackground className="opacity-20" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to transform your workflow?</h2>
            <p className="text-lg mb-8 text-neutral-600 dark:text-neutral-300">
              Join thousands of professionals using FlowSync to stay organized and focused.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600" asChild>
              <Link href="/auth/signin">Get Started Today</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                FlowSync
              </span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-white">
                Privacy
              </a>
              <a href="#" className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-white">
                Terms
              </a>
              <a href="#" className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-white">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-neutral-500 dark:text-neutral-400 text-sm">
            &copy; {new Date().getFullYear()} FlowSync. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Add CSS for animations */}
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </main>
  );
}
