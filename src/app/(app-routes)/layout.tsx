"use client";

import { Navbar } from '@/components/ui/navbar';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 pt-20 pb-16">
        {children}
      </main>
    </>
  );
}