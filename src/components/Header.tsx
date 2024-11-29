import { Menu, X, Newspaper } from "lucide-react";
import { UserButton, useUser } from "@clerk/clerk-react";

interface HeaderProps {
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
}

export function Header({ isSidebarOpen, onSidebarToggle }: HeaderProps) {
  const { isSignedIn } = useUser();

  return (
    <header className="sticky top-0 z-50 bg-gray-950/50 backdrop-blur-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <button
              onClick={onSidebarToggle}
              className="md:hidden p-2 -ml-2 text-gray-400 hover:text-white hover:bg-gray-900/70 rounded-lg transition-colors"
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            <Newspaper className="w-8 h-8 text-purple-400" />
            <span className="font-instrument text-xl text-white">
              KnowSphere
            </span>
          </div>
          <div>{isSignedIn && <UserButton afterSignOutUrl="/" />}</div>
        </div>
      </div>
    </header>
  );
}
