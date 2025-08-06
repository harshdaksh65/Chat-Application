import { MessageCircle } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="flex-1 flex items-center justify-center bg-white">
      <div className="text-center p-8">
        <div className="flex justify-center mb-4">
          <MessageCircle className="w-16 h-16 text-gray-300" />
        </div>
        <h2 className="text-xl font-semibold text-gray-600 mb-2">
          Welcome to Chat
        </h2>
        <p className="text-gray-500 hidden lg:block">
          Select a conversation to start messaging
        </p>
        <p className="text-gray-500 lg:hidden">
          Choose a contact to start chatting
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;