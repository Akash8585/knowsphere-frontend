import { SignInButton } from "@clerk/clerk-react";
import { X } from "lucide-react";

interface AuthPromptProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthPrompt({ isOpen, onClose }: AuthPromptProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 p-8 rounded-2xl max-w-md w-full mx-4 relative border border-gray-800">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-400"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="font-instrument text-2xl text-white mb-4">
          Join KnowSphere
        </h2>
        <p className="text-gray-400 mb-6 font-satoshi">
          Sign in to unlock boundless knowledge, real-time insights, and
          personalized assistance powered by internet-connected AI.
        </p>
        <SignInButton mode="modal">
          <button
            className="w-full px-4 py-3 bg-purple-500 text-white rounded-xl font-medium
                         hover:bg-purple-600 transition-colors font-satoshi"
          >
            Sign in to continue
          </button>
        </SignInButton>
      </div>
    </div>
  );
}
