import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";

interface EditorProps {
  code: string;
  onCodeChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  editorRef: React.RefObject<HTMLTextAreaElement | null>;
  selectedLanguage: string;
  onLanguageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

// Memoized Editor Component
const Editor = React.memo(
  ({
    code,
    onCodeChange,
    editorRef,
    selectedLanguage,
    onLanguageChange,
  }: EditorProps) => {
    return (
      <div className="editor flex flex-col" style={editorStyle}>
        <div className="head flex justify-end gap-4 p-2 bg-gray-800/70 border-b border-gray-700">
          <select
            className="bg-gray-700 rounded px-3 py-1 text-sm hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={onLanguageChange}
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
          onChange={onCodeChange}
        />
      </div>
    );
  }
);

interface TerminalProps {
  terminalOutput: string;
}

// Memoized Terminal Component
const Terminal = React.memo(({ terminalOutput }: TerminalProps) => {
  return (
    <div className="terminal flex flex-col" style={terminalStyle}>
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
  );
});

interface ChatbotProps {
  chatResponse: string;
  chatInput: string;
  onChatInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChatSend: () => void;
}

// Memoized Chatbot Component
const Chatbot = React.memo(
  ({
    chatResponse,
    chatInput,
    onChatInputChange,
    onChatSend,
  }: ChatbotProps) => {
    return (
      <div
        className="chatbot flex flex-col justify-between"
        style={chatbotStyle}
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
            onChange={onChatInputChange}
            placeholder="Type your message..."
            className="flex-1 bg-gray-700 p-2 rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          />
          <button
            onClick={onChatSend}
            className="bg-blue-600 px-4 py-2 rounded text-sm hover:bg-blue-700 transition-all duration-200"
          >
            Send
          </button>
        </div>
      </div>
    );
  }
);

interface ExplanationProps {
  explanation: string;
}

// Memoized Explanation Component
const Explanation = React.memo(({ explanation }: ExplanationProps) => {
  return (
    <div className="explain flex flex-col" style={explanationStyle}>
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
  );
});

// Predefined styles to avoid inline object creation
const editorStyle = { height: "60%" };
const terminalStyle = { height: "40%" };
const chatbotStyle = { height: "60%" };
const explanationStyle = { height: "40%" };

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
  const [selectedLanguage, setSelectedLanguage] = useState("Plain Text");

  const containerRef = useRef<HTMLDivElement | null>(null);
  const leftSectionRef = useRef<HTMLDivElement | null>(null);
  const rightSectionRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<HTMLTextAreaElement | null>(null);
  const isResizingHorizontal = useRef(false);
  const isResizingVerticalLeft = useRef(false);
  const isResizingVerticalRight = useRef(false);

  // Use the correct type for timeout
  let timeout: ReturnType<typeof setTimeout>;

  // Memoize cursor position calculation
  const computeCursorPosition = useCallback(
    (code: string, cursorPos: number) => {
      const textBeforeCursor = code.substring(0, cursorPos);
      const lines = textBeforeCursor.split("\n");
      return {
        line: lines.length,
        col: lines[lines.length - 1].length + 1,
      };
    },
    []
  );

  // Memoized event handlers
  const handleCodeChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newCode = e.target.value;
      setCode(newCode);
      if (editorRef.current) {
        const cursorPos = (editorRef.current as HTMLTextAreaElement)
          .selectionStart;
        setCursorPosition(computeCursorPosition(newCode, cursorPos));
      }
    },
    [computeCursorPosition]
  );

  const updateCursorPosition = useCallback(() => {
    if (editorRef.current) {
      const cursorPos = (editorRef.current as HTMLTextAreaElement)
        .selectionStart;
      setCursorPosition(computeCursorPosition(code, cursorPos));
    }
  }, [code, computeCursorPosition]);

  const handleLanguageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedLanguage(e.target.value || "Plain Text");
    },
    []
  );

  const handleChatSend = useCallback(() => {
    setChatResponse(`AI Response: ${chatInput}`);
    setExplanation(`Explanation: This is a response to "${chatInput}"`);
    setTerminalOutput(`Terminal: Processed "${chatInput}"`);
    setChatInput("");
  }, [chatInput]);

  const handleChatInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setChatInput(e.target.value);
    },
    []
  );

  // Debounced resize handlers
  const debounce = (fn: Function, delay: number) => {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  };

  // Address the implicit any type for the parameter e
  const handleHorizontalMouseMove = useCallback(
    debounce((e: MouseEvent) => {
      if (!isResizingHorizontal.current || !containerRef.current) return;
      const container = containerRef.current;
      const containerWidth = container.getBoundingClientRect().width;
      const newLeftWidth =
        ((e.clientX - container.getBoundingClientRect().left) /
          containerWidth) *
        100;
      setLeftWidth(Math.max(20, Math.min(80, newLeftWidth)));
    }, 10),
    []
  );

  const handleHorizontalMouseUp = useCallback(() => {
    isResizingHorizontal.current = false;
    document.removeEventListener("mousemove", handleHorizontalMouseMove);
    document.removeEventListener("mouseup", handleHorizontalMouseUp);
  }, [handleHorizontalMouseMove]);

  const handleHorizontalMouseDown = useCallback(() => {
    isResizingHorizontal.current = true;
    document.addEventListener("mousemove", handleHorizontalMouseMove);
    document.addEventListener("mouseup", handleHorizontalMouseUp);
  }, [handleHorizontalMouseMove, handleHorizontalMouseUp]);

  const handleVerticalLeftMouseMove = useCallback(() => {
    // Implementation of handleVerticalLeftMouseMove
  }, []);

  const handleVerticalLeftMouseUp = useCallback(() => {
    isResizingVerticalLeft.current = false;
    document.removeEventListener("mousemove", handleVerticalLeftMouseMove);
    document.removeEventListener("mouseup", handleVerticalLeftMouseUp);
  }, [handleVerticalLeftMouseMove]);

  const handleVerticalLeftMouseDown = useCallback(() => {
    isResizingVerticalLeft.current = true;
    document.addEventListener("mousemove", handleVerticalLeftMouseMove);
    document.addEventListener("mouseup", handleVerticalLeftMouseUp);
  }, [handleVerticalLeftMouseMove, handleVerticalLeftMouseUp]);

  const handleVerticalRightMouseMove = useCallback(() => {
    // Implementation of handleVerticalRightMouseMove
  }, []);

  const handleVerticalRightMouseUp = useCallback(() => {
    isResizingVerticalRight.current = false;
    document.removeEventListener("mousemove", handleVerticalRightMouseMove);
    document.removeEventListener("mouseup", handleVerticalRightMouseUp);
  }, [handleVerticalRightMouseMove]);

  const handleVerticalRightMouseDown = useCallback(() => {
    isResizingVerticalRight.current = true;
    document.addEventListener("mousemove", handleVerticalRightMouseMove);
    document.addEventListener("mouseup", handleVerticalRightMouseUp);
  }, [handleVerticalRightMouseMove, handleVerticalRightMouseUp]);

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleHorizontalMouseMove);
      document.removeEventListener("mouseup", handleHorizontalMouseUp);
      // Cleanup for other resizers
    };
  }, [handleHorizontalMouseMove, handleHorizontalMouseUp]);

  // Memoized styles
  const leftSectionStyle = useMemo(
    () => ({ width: `${leftWidth}%` }),
    [leftWidth]
  );
  const rightSectionStyle = useMemo(
    () => ({ width: `${100 - leftWidth}%` }),
    [leftWidth]
  );
  const editorHeightStyle = useMemo(
    () => ({ height: `${editorHeight}%` }),
    [editorHeight]
  );
  const terminalHeightStyle = useMemo(
    () => ({ height: `${100 - editorHeight}%` }),
    [editorHeight]
  );
  const chatHeightStyle = useMemo(
    () => ({ height: `${chatHeight}%` }),
    [chatHeight]
  );
  const explanationHeightStyle = useMemo(
    () => ({ height: `${100 - chatHeight}%` }),
    [chatHeight]
  );

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
          onClick={useCallback(() => setIsDarkMode((prev) => !prev), [])}
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
          style={leftSectionStyle}
          ref={leftSectionRef}
        >
          <Editor
            code={code}
            onCodeChange={handleCodeChange}
            editorRef={editorRef}
            selectedLanguage={selectedLanguage}
            onLanguageChange={handleLanguageChange}
          />
          <div
            className="h-2 bg-gray-700 hover:bg-gray-600 cursor-row-resize transition-colors duration-200"
            onMouseDown={handleVerticalLeftMouseDown}
          />
          <Terminal terminalOutput={terminalOutput} />
        </div>
        <div
          className="w-2 bg-gray-700 hover:bg-gray-600 cursor-col-resize transition-colors duration-200"
          onMouseDown={handleHorizontalMouseDown}
        />
        <div
          className="right flex flex-col border-l border-gray-700"
          style={rightSectionStyle}
          ref={rightSectionRef}
        >
          <Chatbot
            chatResponse={chatResponse}
            chatInput={chatInput}
            onChatInputChange={handleChatInputChange}
            onChatSend={handleChatSend}
          />
          <div
            className="h-2 bg-gray-700 hover:bg-gray-600 cursor-row-resize transition-colors duration-200"
            onMouseDown={handleVerticalRightMouseDown}
          />
          <Explanation explanation={explanation} />
        </div>
      </div>
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
