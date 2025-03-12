import { useRef } from "react";
import { useIdeContext } from "../context/IDEContext";
import { Editor } from "@monaco-editor/react";
import { CODE_SNIPPETS, LANGUAGE_VERSIONS } from "../constant/constant";

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
  const editorRef = useRef<any>(null); // Changed to any since Monaco editor isn't a standard textarea
  const languages = Object.entries(LANGUAGE_VERSIONS);

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || "";
    setCode(newCode);
    // Cursor position will be updated by Monaco's built-in listener
  };

  const updateCursorPosition = (e: any) => {
    if (!editorRef.current) return;

    const position = editorRef.current.getPosition();
    setCursorPosition({
      line: position.lineNumber,
      col: position.column,
    });
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value || "Plain Text";
    setSelectedLanguage(newLanguage);
    setCode(
      CODE_SNIPPETS[newLanguage as keyof typeof CODE_SNIPPETS]?.helloWorld ||
        "Select language"
    );
  };

  const onMount = (editor: any) => {
    editorRef.current = editor;
    // Set up Monaco's built-in cursor position listener
    editor.onDidChangeCursorPosition(updateCursorPosition);
    // Initial cursor position
    const position = editor.getPosition();
    setCursorPosition({
      line: position.lineNumber,
      col: position.column,
    });
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
          {languages.map(([language, version]) => {
            return <option value={language}>{language}</option>;
          })}
        </select>
        <button className="bg-green-600 px-4 py-1 rounded text-sm hover:bg-green-700 transition-all duration-200 transform hover:scale-105">
          Run
        </button>
      </div>
      <Editor
        value={code}
        theme="vs-dark"
        defaultValue={
          CODE_SNIPPETS[selectedLanguage as keyof typeof CODE_SNIPPETS]
            ?.helloWorld || "Select language"
        }
        className="w-full flex-1 bg-gray-800/30 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        onChange={handleCodeChange}
        onMount={onMount}
        language={selectedLanguage}
        // Removed onKeyUp and onClick as they're handled by onDidChangeCursorPosition
      />
      <div
        className="h-2 bg-gray-700 hover:bg-gray-600 cursor-row-resize transition-colors duration-200"
        onMouseDown={handleVerticalLeftMouseDown}
      />
    </div>
  );
}
