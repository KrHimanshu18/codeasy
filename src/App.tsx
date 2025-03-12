import { useState, useRef, useEffect } from "react";
import ChatBot from "./components/ChatBot";
import CodeEditor from "./components/CodeEditor";
import Explanation from "./components/Explanation";
import StatusBar from "./components/StatusBar";
import Terminal from "./components/Terminal";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const [code, setCode] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [explanation, setExplanation] = useState("");
  const [terminalOutput, setTerminalOutput] = useState("");
  const [leftWidth, setLeftWidth] = useState(60);
  const [editorHeight, setEditorHeight] = useState(60);
  const [chatHeight, setChatHeight] = useState(60);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, col: 1 });
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const leftSectionRef = useRef<HTMLDivElement | null>(null);
  const rightSectionRef = useRef<HTMLDivElement | null>(null);
  const isResizingHorizontal = useRef(false);
  const isResizingVerticalLeft = useRef(false);
  const isResizingVerticalRight = useRef(false);

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

  const handleChatSend = () => {
    setChatResponse(`AI Response: ${chatInput}`);
    setExplanation(`Explanation: This is a response to "${chatInput}"`);
    setTerminalOutput(`Terminal: Processed "${chatInput}"`);
    setChatInput("");
  };

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

      <div className="main flex-1 flex overflow-hidden" ref={containerRef}>
        <div
          className="left flex flex-col border-r border-gray-700"
          style={{ width: `${leftWidth}%` }}
          ref={leftSectionRef}
        >
          <CodeEditor
            code={code}
            setCode={setCode}
            editorHeight={editorHeight}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            cursorPosition={cursorPosition}
            setCursorPosition={setCursorPosition}
            handleVerticalLeftMouseDown={handleVerticalLeftMouseDown}
          />
          <Terminal
            terminalOutput={terminalOutput}
            editorHeight={editorHeight}
          />
        </div>

        <div
          className="w-2 bg-gray-700 hover:bg-gray-600 cursor-col-resize transition-colors duration-200"
          onMouseDown={handleHorizontalMouseDown}
        />

        <div
          className="right flex flex-col border-l border-gray-700"
          style={{ width: `${100 - leftWidth}%` }}
          ref={rightSectionRef}
        >
          <ChatBot
            chatInput={chatInput}
            setChatInput={setChatInput}
            chatResponse={chatResponse}
            chatHeight={chatHeight}
            handleChatSend={handleChatSend}
            handleVerticalRightMouseDown={handleVerticalRightMouseDown}
          />
          <Explanation explanation={explanation} chatHeight={chatHeight} />
        </div>
      </div>

      <StatusBar
        cursorPosition={cursorPosition}
        selectedLanguage={selectedLanguage}
      />
    </div>
  );
}

export default App;
