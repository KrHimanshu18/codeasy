import { useState, useRef, useEffect } from "react";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const [code, setCode] = useState("");
  const [chatResponse, setChatResponse] = useState(""); // New state for AI chatbot
  const [explanation, setExplanation] = useState(""); // New state for explanation
  const [terminalOutput, setTerminalOutput] = useState(""); // New state for terminal
  const [leftWidth, setLeftWidth] = useState(60);
  const [editorHeight, setEditorHeight] = useState(60);
  const [chatHeight, setChatHeight] = useState(60);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, col: 1 });
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const leftSectionRef = useRef<HTMLDivElement | null>(null);
  const rightSectionRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<HTMLTextAreaElement | null>(null);
  const isResizingHorizontal = useRef(false);
  const isResizingVerticalLeft = useRef(false);
  const isResizingVerticalRight = useRef(false);

  // Existing resize handlers remain unchanged
  const handleHorizontalMouseMove = (e: MouseEvent) => {
    if (!isResizingHorizontal.current || !containerRef.current) return;
    const container = containerRef.current;
    const containerWidth = container.getBoundingClientRect().width;
    const newLeftWidth =
      ((e.clientX - container.getBoundingClientRect().left) / containerWidth) *
      100;
    const constrainedWidth = Math.max(20, Math.min(80, newLeftWidth));
    setLeftWidth(constrainedWidth);
  };

  const handleHorizontalMouseUp = () => {
    isResizingHorizontal.current = false;
    document.removeEventListener("mousemove", handleHorizontalMouseMove);
    document.removeEventListener("mouseup", handleHorizontalMouseUp);
  };

  const handleHorizontalMouseDown = () => {
    isResizingHorizontal.current = true;
    document.addEventListener("mousemove", handleHorizontalMouseMove);
    document.addEventListener("mouseup", handleHorizontalMouseUp);
  };

  const handleVerticalLeftMouseMove = (e: MouseEvent) => {
    if (!isResizingVerticalLeft.current || !leftSectionRef.current) return;
    const container = leftSectionRef.current;
    const containerHeight = container.getBoundingClientRect().height;
    const newEditorHeight =
      ((e.clientY - container.getBoundingClientRect().top) / containerHeight) *
      100;
    const constrainedHeight = Math.max(20, Math.min(80, newEditorHeight));
    setEditorHeight(constrainedHeight);
  };

  const handleVerticalLeftMouseUp = () => {
    isResizingVerticalLeft.current = false;
    document.removeEventListener("mousemove", handleVerticalLeftMouseMove);
    document.removeEventListener("mouseup", handleVerticalLeftMouseUp);
  };

  const handleVerticalLeftMouseDown = () => {
    isResizingVerticalLeft.current = true;
    document.addEventListener("mousemove", handleVerticalLeftMouseMove);
    document.addEventListener("mouseup", handleVerticalLeftMouseUp);
  };

  const handleVerticalRightMouseMove = (e: MouseEvent) => {
    if (!isResizingVerticalRight.current || !rightSectionRef.current) return;
    const container = rightSectionRef.current;
    const containerHeight = container.getBoundingClientRect().height;
    const newChatHeight =
      ((e.clientY - container.getBoundingClientRect().top) / containerHeight) *
      100;
    const constrainedHeight = Math.max(20, Math.min(80, newChatHeight));
    setChatHeight(constrainedHeight);
  };

  const handleVerticalRightMouseUp = () => {
    isResizingVerticalRight.current = false;
    document.removeEventListener("mousemove", handleVerticalRightMouseMove);
    document.removeEventListener("mouseup", handleVerticalRightMouseUp);
  };

  const handleVerticalRightMouseDown = () => {
    isResizingVerticalRight.current = true;
    document.addEventListener("mousemove", handleVerticalRightMouseMove);
    document.addEventListener("mouseup", handleVerticalRightMouseUp);
  };

  // Update cursor position and code
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);

    if (!editorRef.current) return;
    const textarea = editorRef.current;
    const cursorPos = textarea.selectionStart;
    const textBeforeCursor = newCode.substring(0, cursorPos);
    const lines = textBeforeCursor.split("\n");
    const lineNumber = lines.length;
    const columnNumber = lines[lines.length - 1].length + 1;

    setCursorPosition({ line: lineNumber, col: columnNumber });
  };

  const updateCursorPosition = () => {
    if (!editorRef.current) return;

    const textarea = editorRef.current;
    const cursorPos = textarea.selectionStart;
    const textBeforeCursor = code.substring(0, cursorPos);
    const lines = textBeforeCursor.split("\n");
    const lineNumber = lines.length;
    const columnNumber = lines[lines.length - 1].length + 1;

    setCursorPosition({ line: lineNumber, col: columnNumber });
  };

  // Handle language selection
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value || "Plain Text";
    setSelectedLanguage(newLanguage);
  };

  // Handle chat send (example implementation)
  const handleChatSend = () => {
    // For now, just echo the input as a response
    setChatResponse(`AI Response: ${chatInput}`);
    setExplanation(`Explanation: This is a response to "${chatInput}"`);
    setTerminalOutput(`Terminal: Processed "${chatInput}"`);
    setChatInput("");
  };

  // Cleanup and event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleHorizontalMouseMove);
      document.removeEventListener("mouseup", handleHorizontalMouseUp);
      document.removeEventListener("mousemove", handleVerticalLeftMouseMove);
      document.removeEventListener("mouseup", handleVerticalLeftMouseUp);
      document.removeEventListener("mousemove", handleVerticalRightMouseMove);
      document.removeEventListener("mouseup", handleVerticalRightMouseUp);
    };
  }, []);

  return (
    <div
      className={`app w-full h-screen flex flex-col transition-all duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Header */}
      <div className="appname w-full h-14 px-6 flex items-center justify-between border-b border-gray-700 shadow-md">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Codeasy
        </h1>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-full hover:bg-gray-800 transition-colors duration-200"
        >
          {isDarkMode ? "☀️" : "🌙"}
        </button>
      </div>

      {/* Navbar */}
      <div className="navbar flex gap-8 px-6 py-3 border-b border-gray-700 bg-gray-800/50">
        {["File", "Terminal", "View", "Console", "Settings"].map((item) => (
          <a
            key={item}
            href="#"
            className="text-sm font-medium hover:text-blue-400 transition-colors duration-200 transform hover:scale-105"
          >
            {item}
          </a>
        ))}
      </div>

      {/* Main Content */}
      <div className="main flex-1 flex overflow-hidden" ref={containerRef}>
        {/* Left Section */}
        <div
          className="left flex flex-col border-r border-gray-700"
          style={{ width: `${leftWidth}%` }}
          ref={leftSectionRef}
        >
          {/* Editor */}
          <div
            className="editor flex flex-col"
            style={{ height: `${editorHeight}%` }}
          >
            <div className="head flex justify-end gap-4 p-2 bg-gray-800/70 border-b border-gray-700">
              <select
                className="bg-gray-700 rounded px-3 py-1 text-sm hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleLanguageChange}
                value={selectedLanguage}
              >
                <option value="Plain Text">Language</option>
                <option value="C">C</option>
                <option value="C++">C++</option>
                <option value="Java">Java</option>
                <option value="Python">Python</option>
                <option value="JavaScript">JavaScript</option>
                <option value="Ruby">Ruby</option>
              </select>
              <button className="bg-green-600 px-4 py-1 rounded text-sm hover:bg-green-700 transition-all duration-200 transform hover:scale-105">
                Run
              </button>
            </div>
            <textarea
              ref={editorRef}
              name="code"
              placeholder="Write your code here..."
              value={code}
              className="w-full flex-1 bg-gray-800/30 p-4 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              onKeyUp={updateCursorPosition}
              onClick={updateCursorPosition}
              onChange={handleCodeChange}
            />
          </div>

          {/* Vertical Resizer (Left) */}
          <div
            className="h-2 bg-gray-700 hover:bg-gray-600 cursor-row-resize transition-colors duration-200"
            onMouseDown={handleVerticalLeftMouseDown}
          />

          {/* Terminal */}
          <div
            className="terminal flex flex-col"
            style={{ height: `${100 - editorHeight}%` }}
          >
            <div className="head p-3 bg-gray-800/70 flex justify-between">
              <h2 className="text-lg font-semibold">Terminal</h2>
              <button className="bg-blue-600 px-4 py-1 rounded text-sm hover:bg-blue-700 transition-all duration-200">
                Debug
              </button>
            </div>
            <div className="output flex-1 p-4 bg-gray-800/30 font-mono text-sm overflow-auto">
              <textarea
                placeholder="Terminal output will be displayed here..."
                value={terminalOutput}
                readOnly
                className="w-full h-full bg-transparent font-mono text-sm resize-none focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Horizontal Resizer */}
        <div
          className="w-2 bg-gray-700 hover:bg-gray-600 cursor-col-resize transition-colors duration-200"
          onMouseDown={handleHorizontalMouseDown}
        />

        {/* Right Section */}
        <div
          className="right flex flex-col border-l border-gray-700"
          style={{ width: `${100 - leftWidth}%` }}
          ref={rightSectionRef}
        >
          {/* Chatbot */}
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
                onClick={handleChatSend}
                className="bg-blue-600 px-4 py-2 rounded text-sm hover:bg-blue-700 transition-all duration-200"
              >
                Send
              </button>
            </div>
          </div>

          {/* Vertical Resizer (Right) */}
          <div
            className="h-2 bg-gray-700 hover:bg-gray-600 cursor-row-resize transition-colors duration-200"
            onMouseDown={handleVerticalRightMouseDown}
          />

          {/* Explanation */}
          <div
            className="explain flex flex-col"
            style={{ height: `${100 - chatHeight}%` }}
          >
            <div className="flex justify-between items-center p-3 bg-gray-800/70 border-b border-gray-700">
              <h2 className="text-lg font-semibold">AI Explanation</h2>
            </div>
            <div className="response bg-gray-800/50 p-3 shadow-md animate-slideUp flex-1">
              <textarea
                placeholder="No code to explain"
                value={explanation}
                readOnly
                className="w-full h-full bg-transparent text-white resize-none focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Updated Status Bar */}
      <div className="status-bar w-full h-8 px-4 flex items-center justify-between bg-gray-800/70 border-t border-gray-700 text-sm">
        <div className="left-status flex items-center gap-4">
          <span>
            Ln {cursorPosition.line}, Col {cursorPosition.col}
          </span>
          <span>UTF-8</span>
          <span>{selectedLanguage}</span>
        </div>
        <div className="right-status flex items-center gap-4">
          <span>Connected</span>
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
        </div>
      </div>
    </div>
  );
}

export default App;
