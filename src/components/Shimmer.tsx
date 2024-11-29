import { cn } from "../lib/utils";

interface ShimmerProps {
  className?: string;
}

export function Shimmer({ className }: ShimmerProps) {
  return (
    <div
      className={cn(
        "animate-shimmer bg-gradient-to-r from-transparent via-gray-800/50 to-transparent",
        className
      )}
    />
  );
}
