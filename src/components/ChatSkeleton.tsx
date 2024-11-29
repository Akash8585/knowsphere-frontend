import { Shimmer } from "./Shimmer";

export function ChatSkeleton() {
  return (
    <div className="space-y-6">
      {/* User message skeleton */}
      <div className="flex gap-2 sm:gap-4 p-4 sm:p-6 rounded-xl bg-gray-900/50">
        <div className="flex-shrink-0">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center bg-blue-500/20" />
        </div>
        <div className="flex-1 space-y-2.5">
          <Shimmer className="h-4 w-2/3 rounded" />
          <Shimmer className="h-4 w-1/2 rounded" />
        </div>
      </div>

      {/* Bot message skeleton */}
      <div className="flex gap-2 sm:gap-4 p-4 sm:p-6 rounded-xl bg-gray-900/50">
        <div className="flex-shrink-0">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center bg-purple-500/20" />
        </div>
        <div className="flex-1 space-y-2.5">
          <Shimmer className="h-4 w-3/4 rounded" />
          <Shimmer className="h-4 w-1/2 rounded" />
          <Shimmer className="h-4 w-2/3 rounded" />
        </div>
      </div>
    </div>
  );
}
