import { useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const Home = () => {
  const { selectedUser } = useSelector((state) => state.chat);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex items-center justify-center lg:pt-20 lg:px-4 ">
        <div className="bg-white overflow-hidden rounded-lg lg:rounded-lg lg:shadow-md w-full max-w-6xl h-screen lg:h-[calc(100vh-8rem)]">
          <div className="flex h-full overflow-hidden relative">
            {/* Sidebar with smooth slide animation */}
            <div className={`${
              selectedUser ? 'lg:flex' : 'flex'
            } h-full transition-all duration-500 ease-in-out lg:relative lg:translate-x-0 ${
              selectedUser 
                ? 'absolute inset-0 -translate-x-full lg:translate-x-0 z-10 opacity-0 lg:opacity-100' 
                : 'absolute inset-0 translate-x-0 z-20 lg:relative lg:z-auto opacity-100'
            }`}>
              <Sidebar />
            </div>

            {/* Chat container with smooth slide animation */}
            <div className={`flex-1 transition-all duration-500 ease-in-out lg:relative lg:translate-x-0 ${
              selectedUser 
                ? 'absolute inset-0 translate-x-0 z-20 lg:relative lg:z-auto flex opacity-100' 
                : 'absolute inset-0 translate-x-full lg:translate-x-0 z-10 hidden lg:flex opacity-0 lg:opacity-100'
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