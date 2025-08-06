import { useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const Home = () => {
  const { selectedUser } = useSelector((state) => state.chat);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex items-center justify-center lg:pt-20 lg:px-4">
        <div className="bg-white lg:rounded-lg lg:shadow-md w-full max-w-6xl h-screen lg:h-[calc(100vh-8rem)]">
          <div className="flex h-full overflow-hidden">
            {/* Mobile: Show sidebar when no user selected, hide when user selected */}
            {/* Desktop: Always show sidebar */}
            <div className={`${
              selectedUser ? 'hidden lg:flex' : 'flex'
            } h-full`}>
              <Sidebar />
            </div>

            {/* Mobile: Show chat when user selected, hide when no user selected */}
            {/* Desktop: Always show chat area */}
            <div className={`flex-1 ${
              selectedUser ? 'flex' : 'hidden lg:flex'
            }`}>
              {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;