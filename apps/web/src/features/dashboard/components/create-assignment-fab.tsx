"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export function CreateAssignmentFab() {
  const router = useRouter();

  return (
    <motion.button
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => router.push("/assignments/new")}
      className="fixed bottom-[calc(env(safe-area-inset-bottom)+80px)] right-4 lg:bottom-8 lg:right-8 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-primary-foreground shadow-soft-lg hover:bg-accent/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:h-auto lg:w-auto lg:px-6 lg:py-3 lg:rounded-full"
      aria-label="Create Assignment"
    >
      <Plus className="h-6 w-6 lg:mr-2" />
      <span className="hidden lg:block font-medium">Create Assignment</span>
    </motion.button>
  );
}
