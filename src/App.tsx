import CodeEditor from "./components/CodeEditor";
import Terminal from "./components/Terminal";
import ChatBot from "./components/ChatBot";
import Explanation from "./components/Explanation";
import StatusBar from "./components/StatusBar";
import { IdeProvider, useIdeContext } from "./context/IDEContext";

function AppContent() {
  const {
    isDarkMode,
    setIsDarkMode,
    leftWidth,
    containerRef,
    leftSectionRef,
    rightSectionRef,
    handleHorizontalMouseDown,
  } = useIdeContext();

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
          <CodeEditor />
          <Terminal />
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
          <ChatBot />
          <Explanation />
        </div>
      </div>

      <StatusBar />
    </div>
  );
}

function App() {
  return (
    <IdeProvider>
      <AppContent />
    </IdeProvider>
  );
}

export default App;
