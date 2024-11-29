import { useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { SearchBar } from "./components/SearchBar";
import { ChatMessage } from "./components/ChatMessage";
import { Header } from "./components/Header";
import { AuthPrompt } from "./components/AuthPrompt";
import { Sidebar } from "./components/Sidebar";
import { SuggestionChips } from "./components/SuggestionChips";
import { Shimmer } from "./components/Shimmer";
import { Thread, Message } from "./lib/types";
import {
  GET_ALL_THREADS,
  GET_THREAD_MESSAGES,
  CREATE_THREAD,
  GET_REPLY,
  DELETE_THREAD,
} from "./lib/graphql/queries";
import { ChatSkeleton } from "./components/ChatSkeleton";

function App() {
  const [activeThread, setActiveThread] = useState<Thread | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const { isSignedIn } = useUser();
  const { getToken } = useAuth();
  const [hasToken, setHasToken] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = await getToken();
      setHasToken(!!token);
    };
    checkToken();
  }, [getToken]);

  const { data: threadsData, refetch: refetchThreads } = useQuery(
    GET_ALL_THREADS,
    {
      skip: !hasToken,
    }
  );

  const [createThread] = useMutation(CREATE_THREAD);
  const [getReply] = useLazyQuery(GET_REPLY);
  const [getThreadMessages] = useLazyQuery(GET_THREAD_MESSAGES);
  const [deleteThread] = useMutation(DELETE_THREAD);

  const threads = threadsData?.allThreads || [];

  const handleSearch = async (query: string) => {
    if (!isSignedIn) {
      setShowAuthPrompt(true);
      return;
    }

    if (!hasToken) return;

    try {
      // Create and display user message immediately
      const userMessage: Message = {
        id: Date.now().toString(),
        thread_id: activeThread?.id || "pending",
        role: "user",
        content: query,
        created_at: Date.now(),
      };
      setLocalMessages((prev) => [...prev, userMessage]);
      setIsThinking(true);

      if (!activeThread) {
        // Create new thread
        const { data: threadData } = await createThread({
          variables: { firstMessage: query },
        });

        // Update active thread
        setActiveThread(threadData.createThread);

        // Get AI reply
        const { data: replyData } = await getReply({
          variables: {
            threadId: threadData.createThread.id,
            userMessage: query,
          },
        });

        if (replyData?.reply) {
          setLocalMessages([userMessage, replyData.reply]);
        }

        // Update thread list in background
        refetchThreads();
      } else {
        // Get AI reply for existing thread
        const { data: replyData } = await getReply({
          variables: {
            threadId: activeThread.id,
            userMessage: query,
          },
        });

        if (replyData?.reply) {
          setLocalMessages((prev) => [...prev, replyData.reply]);
        }
      }
    } catch (error) {
      console.error("Error processing message:", error);
    } finally {
      setIsThinking(false);
    }
  };

  const handleNewChat = () => {
    setActiveThread(null);
    setLocalMessages([]);
  };

  const handleThreadSelect = async (thread: Thread) => {
    setActiveThread(thread);
    setIsLoadingMessages(true);
    try {
      const { data } = await getThreadMessages({
        variables: { threadId: thread.id },
      });
      if (data?.threadMessages) {
        setLocalMessages(data.threadMessages);
      }
    } catch (error) {
      console.error("Error loading thread messages:", error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleDeleteThread = async (threadId: string) => {
    try {
      await deleteThread({ variables: { threadId } });
      if (activeThread?.id === threadId) {
        setActiveThread(null);
        setLocalMessages([]);
      }
      await refetchThreads();
    } catch (error) {
      console.error("Error deleting thread:", error);
      throw error;
    }
  };

  if (isSignedIn && !hasToken) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="space-y-4 w-64">
          <Shimmer className="h-4 w-full rounded" />
          <Shimmer className="h-4 w-3/4 rounded" />
          <Shimmer className="h-4 w-1/2 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <div
        className={`fixed top-0 bottom-0 z-30 w-72 bg-gray-950 border-r border-gray-800 transition-transform duration-300 md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          threads={threads}
          activeThread={activeThread}
          onThreadSelect={handleThreadSelect}
          onNewChat={handleNewChat}
          onDeleteThread={handleDeleteThread}
          isOpen={isSidebarOpen}
          onToggle={handleSidebarToggle}
        />
      </div>
      <div className="flex-1 flex flex-col md:pl-72 w-full relative">
        <Header
          isSidebarOpen={isSidebarOpen}
          onSidebarToggle={handleSidebarToggle}
        />
        <main className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-4xl pb-36">
            {activeThread && (
              <div className="mb-6">
                <h1 className="text-xl font-medium text-gray-200">
                  {activeThread.title}
                </h1>
              </div>
            )}
            {!activeThread && !localMessages.length && (
              <div className="flex-1 flex flex-col justify-center items-center text-center">
                <div className="max-w-2xl mx-auto px-4">
                  <h1 className="font-instrument text-3xl md:text-5xl lg:text-6xl text-white mb-4 leading-tight">
                    Meet
                    <br />
                    <span className="text-purple-400">KnowSphere</span>
                  </h1>
                  <p className="font-satoshi text-gray-400 text-base md:text-lg mb-4 max-w-xl mx-auto">
                    Your intelligent companion that knows no bounds. Code,
                    learn, and explore with an AI that understands you.
                  </p>
                  <p className="font-satoshi text-purple-400/80 text-sm md:text-base mb-8 max-w-xl mx-auto">
                    Connected to the internet for real-time information, latest
                    tech updates, and current events.
                  </p>
                  <SuggestionChips onSelect={handleSearch} />
                </div>
              </div>
            )}
            <div className="space-y-6 flex-1 overflow-auto">
              {isLoadingMessages ? (
                <ChatSkeleton />
              ) : (
                <>
                  {localMessages.map((message: Message) => (
                    <ChatMessage
                      key={message.id}
                      isBot={message.role === "assistant"}
                      message={message.content}
                      useMarkdown={message.role === "assistant"}
                      sources={message.sources}
                    />
                  ))}
                  {isThinking && (
                    <div className="flex gap-2 sm:gap-4 p-4 sm:p-6 rounded-xl bg-gray-900/50">
                      <div className="flex-shrink-0">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center bg-purple-500/20">
                          <Shimmer className="w-4 h-4 sm:w-5 sm:h-5 rounded-full" />
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <Shimmer className="h-4 w-3/4 rounded" />
                        <Shimmer className="h-4 w-1/2 rounded" />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
        <div className="fixed bottom-0 md:left-72 left-0 right-0 bg-gradient-to-t from-gray-950 via-gray-950 to-transparent pt-6 pb-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </div>
      <AuthPrompt
        isOpen={showAuthPrompt}
        onClose={() => setShowAuthPrompt(false)}
      />
    </div>
  );
}

export default App;
