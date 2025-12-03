"use client";
import { useEffect } from "react";
import { testApi } from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6 space-y-6">
      <h1 className="text-5xl font-bold text-turquoise">EventHub</h1>
      <p className="text-lg max-w-md text-gray-300">
        Discover events. Earn rewards. Have fun.
      </p>
      <div className="flex gap-4">
        <Link href="/events">
          <Button>Explore Events</Button>
        </Link>
        <Link href="/auth/login">
          <Button variant="outline" className="border-turquoise text-turquoise">
            Login / Register
          </Button>
        </Link>
      </div>
    </main>
  );
}
