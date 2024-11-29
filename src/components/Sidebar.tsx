import { MessageSquare, PlusCircle, Clock, Trash2 } from "lucide-react";
import { clsx } from "clsx";
import { Thread } from "../lib/types";
import { useState } from "react";
import { Spinner } from "./Spinner";

interface SidebarProps {
  threads: Thread[];
  activeThread: Thread | null;
  onThreadSelect: (thread: Thread) => void;
  onNewChat: () => void;
  onDeleteThread: (threadId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({
  threads,
  activeThread,
  onThreadSelect,
  onNewChat,
  onDeleteThread,
  isOpen,
  onToggle,
}: SidebarProps) {
  const [deletingThreadId, setDeletingThreadId] = useState<string | null>(null);

  const handleDelete = async (threadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingThreadId(threadId);
    try {
      await onDeleteThread(threadId);
    } finally {
      setDeletingThreadId(null);
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={clsx(
          "fixed md:relative flex flex-col h-[100dvh] transition-transform duration-300",
          "w-72 bg-gray-950 border-r border-gray-800 z-50",
          "md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Add a spacer for header height in mobile */}
        <div className="h-16 md:hidden" />

        <div className="p-4">
          <button
            onClick={onNewChat}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-500
                     text-white rounded-xl font-medium hover:bg-purple-600 transition-colors w-full"
          >
            <PlusCircle className="w-5 h-5" />
            <span>New Chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {threads.length > 0 ? (
            <div className="space-y-1 p-2">
              {threads.map((thread) => (
                <button
                  key={thread.id}
                  onClick={() => onThreadSelect(thread)}
                  className={clsx(
                    "w-full text-left rounded-lg transition-colors",
                    "flex items-start gap-3 group hover:bg-gray-900/50 px-4 py-3",
                    activeThread?.id === thread.id
                      ? "bg-gray-900/50"
                      : "text-gray-400"
                  )}
                >
                  <MessageSquare className="w-5 h-5 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-gray-200">
                      {thread.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3" />
                      <p className="text-xs text-gray-500">
                        {new Date(thread.last_message_at).toLocaleString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDelete(thread.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-800 rounded transition-all"
                    disabled={deletingThreadId === thread.id}
                  >
                    {deletingThreadId === thread.id ? (
                      <Spinner className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Trash2 className="w-4 h-4 text-red-400" />
                    )}
                  </button>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 px-4 text-center">
              <MessageSquare className="w-12 h-12 mb-4 opacity-50" />
              <p className="font-medium">No conversations yet</p>
              <p className="text-sm mt-1">
                Start a new chat to begin exploring
              </p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-800">
          <p className="text-xs text-gray-500 mb-2">
            Powered by AI with real-time news verification and fact-checking
          </p>
        </div>
      </div>
    </>
  );
}
