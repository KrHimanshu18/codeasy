import { useIdeContext } from "../context/IDEContext";
import { getChatResponse } from "./APIs";

export default function ChatBot() {
  const {
    chatInput,
    setChatInput,
    chatResponse,
    chatHeight,
    handleVerticalRightMouseDown,
    setChatResponse,
  } = useIdeContext();

  const fetchChatResponse = async () => {
    try {
      const response = await getChatResponse(chatInput);
      setChatResponse(response);
    } catch (error) {
      setChatResponse("Error fetching chat response");
      console.log(error);
    }
  };

  return (
    <div
      className="chatbot flex flex-col justify-between"
      style={{ height: `${chatHeight}%` }}
    >
      <div className="flex justify-between items-center p-3 bg-gray-800/70 border-b border-gray-700">
        <h2 className="text-lg font-semibold">AI Chat</h2>
        <select className="bg-gray-700 rounded px-3 py-1 text-sm hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>English</option>
          <option>Spanish</option>
          <option>French</option>
        </select>
      </div>
      <div className="response flex-1 overflow-auto animate-fadeIn">
        <textarea
          placeholder="This is the AI response"
          value={chatResponse}
          readOnly
          className="w-full h-full p-4 bg-gray-800/50 shadow-md text-white resize-none focus:outline-none"
        />
      </div>
      <div className="input-section p-3 bg-gray-800/70 flex items-center gap-2 border-t border-gray-700">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-gray-700 p-2 rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        />
        <button
          onClick={fetchChatResponse}
          className="bg-blue-600 px-4 py-2 rounded text-sm hover:bg-blue-700 transition-all duration-200"
        >
          Send
        </button>
      </div>
      <div
        className="h-2 bg-gray-700 hover:bg-gray-600 cursor-row-resize transition-colors duration-200"
        onMouseDown={handleVerticalRightMouseDown}
      />
    </div>
  );
}
