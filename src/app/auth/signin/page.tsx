"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import Link from "next/link";

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/messages" });
    } catch (error) {
      console.error("Failed to sign in with Google", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-3xl font-bold">Sign In</CardTitle>
              <CardDescription>
                Connect with your email and messaging accounts
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
              <Button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 bg-white text-black hover:bg-neutral-100 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 border border-neutral-300 dark:border-neutral-600"
              >
                {isLoading ? (
                  <div className="h-4 w-4 border-t-2 border-neutral-500 border-solid rounded-full animate-spin"></div>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.1711 8.36788H17.5V8.33333H10V11.6667H14.6856C14.0149 13.6501 12.1756 15 10 15C7.23858 15 5 12.7614 5 10C5 7.23858 7.23858 5 10 5C11.2843 5 12.4565 5.46644 13.3424 6.21781L15.7518 3.80847C14.1823 2.39602 12.1896 1.66667 10 1.66667C5.39763 1.66667 1.66667 5.39763 1.66667 10C1.66667 14.6024 5.39763 18.3333 10 18.3333C14.6024 18.3333 18.3333 14.6024 18.3333 10C18.3333 9.45162 18.2746 8.90045 18.1711 8.36788Z" fill="#FBC02D"/>
                    <path d="M2.62744 6.12574L5.36745 8.12581C6.10755 6.29475 7.90274 5 10 5C11.2843 5 12.4565 5.46644 13.3424 6.21781L15.7518 3.80847C14.1823 2.39602 12.1896 1.66667 10 1.66667C6.76149 1.66667 3.9613 3.47899 2.62744 6.12574Z" fill="#E53935"/>
                    <path d="M10 18.3333C12.1484 18.3333 14.1062 17.6317 15.6669 16.2707L13.0207 13.9877C12.1818 14.6634 11.1069 15 10 15C7.83255 15 6.00065 13.6625 5.32035 11.6917L2.5358 13.893C3.85574 16.5894 6.68573 18.3333 10 18.3333Z" fill="#4CAF50"/>
                    <path d="M18.1711 8.36788H17.5V8.33333H10V11.6667H14.6856C14.37 12.6125 13.7578 13.4386 12.9585 14.0407L12.9676 14.0348L15.6137 16.3177C15.4239 16.4877 18.3333 14.1667 18.3333 10C18.3333 9.45162 18.2746 8.90045 18.1711 8.36788Z" fill="#1565C0"/>
                  </svg>
                )}
                <span className="ml-2">Continue with Google</span>
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-300 dark:border-neutral-700"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white dark:bg-neutral-950 text-neutral-500 dark:text-neutral-400">
                    Or continue with
                  </span>
                </div>
              </div>
              
              <Button variant="outline" disabled={true} className="opacity-70 cursor-not-allowed">
                <svg className="mr-2" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0Z" fill="#611f69"/>
                  <path d="M3.27877 9.63061C3.27877 9.01361 3.76877 8.51294 4.39744 8.51294C5.0261 8.51294 5.5161 9.01361 5.5161 9.63061C5.5161 10.2476 5.0261 10.7483 4.39744 10.7483C3.76877 10.7483 3.27877 10.2476 3.27877 9.63061Z" fill="white"/>
                  <path d="M3.27877 6.36939C3.27877 5.75239 3.76877 5.25172 4.39744 5.25172C5.0261 5.25172 5.5161 5.75239 5.5161 6.36939C5.5161 6.98639 5.0261 7.48705 4.39744 7.48705C3.76877 7.48705 3.27877 6.98639 3.27877 6.36939Z" fill="white"/>
                  <path d="M6.48389 9.63061C6.48389 9.01361 6.97389 8.51294 7.60256 8.51294C8.23123 8.51294 8.72123 9.01361 8.72123 9.63061C8.72123 10.2476 8.23123 10.7483 7.60256 10.7483C6.97389 10.7483 6.48389 10.2476 6.48389 9.63061Z" fill="white"/>
                  <path d="M6.48389 6.36939C6.48389 5.75239 6.97389 5.25172 7.60256 5.25172C8.23123 5.25172 8.72123 5.75239 8.72123 6.36939C8.72123 6.98639 8.23123 7.48705 7.60256 7.48705C6.97389 7.48705 6.48389 6.98639 6.48389 6.36939Z" fill="white"/>
                  <path d="M9.61896 9.63061C9.61896 9.01361 10.109 8.51294 10.7376 8.51294C11.3663 8.51294 11.8563 9.01361 11.8563 9.63061C11.8563 10.2476 11.3663 10.7483 10.7376 10.7483C10.109 10.7483 9.61896 10.2476 9.61896 9.63061Z" fill="white"/>
                  <path d="M9.61896 6.36939C9.61896 5.75239 10.109 5.25172 10.7376 5.25172C11.3663 5.25172 11.8563 5.75239 11.8563 6.36939C11.8563 6.98639 11.3663 7.48705 10.7376 7.48705C10.109 7.48705 9.61896 6.98639 9.61896 6.36939Z" fill="white"/>
                </svg>
                Connect with Slack (Coming Soon)
              </Button>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center text-sm text-neutral-500 dark:text-neutral-400">
                By signing in, you agree to our{" "}
                <Link href="#" className="underline hover:text-neutral-800 dark:hover:text-neutral-300">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="underline hover:text-neutral-800 dark:hover:text-neutral-300">
                  Privacy Policy
                </Link>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
        
        <div className="mt-4 text-center">
          <Link 
            href="/"
            className="text-sm text-neutral-500 dark:text-neutral-400 hover:underline"
          >
            ← Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}