"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { useIntersectionObserver } from "usehooks-ts"; // We can implement a simple observer or assume it exists. Since usehooks-ts is not in package.json, let's use a native IntersectionObserver hook approach inline.

interface AssignmentInfiniteScrollProps {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export function AssignmentInfiniteScroll({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: AssignmentInfiniteScrollProps) {
  const loadMoreRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (!hasNextPage) return null;

  return (
    <div ref={loadMoreRef} className="mt-8 flex justify-center py-4">
      {isFetchingNextPage && <Loader2 className="h-6 w-6 animate-spin text-accent" />}
    </div>
  );
}
