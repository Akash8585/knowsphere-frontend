import { FC, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface SourceCardProps {
  url: string;
}

interface URLMetadata {
  title: string | null;
  image: string | null;
  domain: string;
}

const SourceCard: FC<SourceCardProps> = ({ url }) => {
  const [metadata, setMetadata] = useState<URLMetadata>({
    title: null,
    image: null,
    domain: getDomain(url),
  });
  const [isLoading, setIsLoading] = useState(true);

  function getDomain(url: string): string {
    try {
      const domain = url.replace(/^https?:\/\//, "").split("/")[0];
      return domain;
    } catch (error) {
      return url;
    }
  }

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch(
          `https://api.microlink.io?url=${encodeURIComponent(url)}`
        );
        const data = await response.json();

        if (data.status === "success") {
          setMetadata({
            title: data.data.title || null,
            image: data.data.image?.url || null,
            domain: getDomain(url),
          });
        }
      } catch (error) {
        console.error("Error fetching metadata:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetadata();
  }, [url]);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-shrink-0 w-80 bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors group flex h-24"
    >
      <div className="w-24 bg-gray-700 flex items-center justify-center overflow-hidden">
        {metadata.image ? (
          <img
            src={metadata.image}
            alt={metadata.title || "Article preview"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-4xl font-bold text-gray-400">
            {metadata.domain.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <div className="flex-1 p-3 min-w-0 flex flex-col justify-between">
        <h3 className="text-sm font-medium text-gray-200 line-clamp-2">
          {metadata.title || metadata.domain}
        </h3>
        <p className="text-xs text-purple-400 hover:text-purple-300 truncate mt-1">
          {metadata.domain}
        </p>
      </div>
    </a>
  );
};

interface ChatMessageProps {
  isBot: boolean;
  message: string;
  useMarkdown?: boolean;
  sources?: string[];
}

export const ChatMessage: FC<ChatMessageProps> = ({
  isBot,
  message,
  useMarkdown = false,
  sources,
}) => {
  return (
    <div
      className={`flex gap-2 sm:gap-4 p-4 sm:p-6 rounded-xl ${
        isBot ? "bg-gray-900/50" : "bg-purple-500/10"
      }`}
    >
      <div className="flex-shrink-0">
        <div
          className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center ${
            isBot ? "bg-purple-500/20" : "bg-purple-500/30"
          }`}
        >
          <span className="text-white text-sm sm:text-base">
            {isBot ? "AI" : "Y"}
          </span>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        {sources && sources.length > 0 && (
          <div className="relative mb-4">
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-900/50 to-transparent pointer-events-none z-10" />
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
              <div className="flex gap-4 pb-2 px-2 min-w-max">
                {sources.map((source, index) => (
                  <SourceCard key={index} url={source} />
                ))}
              </div>
            </div>
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-900/50 to-transparent pointer-events-none z-10" />
          </div>
        )}

        <div className="break-words">
          {useMarkdown ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              className="prose prose-invert max-w-none prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700 prose-code:text-purple-300 prose-code:before:content-none prose-code:after:content-none"
            >
              {message}
            </ReactMarkdown>
          ) : (
            <p className="text-gray-200 whitespace-pre-wrap">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};
