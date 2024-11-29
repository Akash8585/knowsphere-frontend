export interface Thread {
  id: string;
  title: string;
  clerk_user_id: string;
  created_at: number;
  last_message_at: number;
}

export interface Message {
  id: string;
  thread_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: number;
  sources?: string[];
} 