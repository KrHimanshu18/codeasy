import { useRef } from "react";
import { useIdeContext } from "../context/IDEContext";

export default function CodeEditor() {
  const {
    code,
    setCode,
    editorHeight,
    selectedLanguage,
    setSelectedLanguage,
    cursorPosition,
    setCursorPosition,
    handleVerticalLeftMouseDown,
  } = useIdeContext();
  const editorRef = useRef<HTMLTextAreaElement | null>(null);

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

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value || "Plain Text";
    setSelectedLanguage(newLanguage);
  };

  return (
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
      <div
        className="h-2 bg-gray-700 hover:bg-gray-600 cursor-row-resize transition-colors duration-200"
        onMouseDown={handleVerticalLeftMouseDown}
      />
    </div>
  );
}
