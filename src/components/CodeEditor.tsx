import { useRef } from "react";
import { useIdeContext } from "../context/IDEContext";
import { Editor } from "@monaco-editor/react";
import { CODE_SNIPPETS } from "../constant/constant";
import axios from "axios";

export default function CodeEditor() {
  const {
    code,
    setCode,
    editorHeight,
    selectedLanguage,
    setSelectedLanguage,
    setCursorPosition,
    handleVerticalLeftMouseDown,
    setTerminalOutput,
  } = useIdeContext();

  const editorRef = useRef<any>(null);
  const RAPID_API_KEY = import.meta.env.VITE_RAPID_API_KEY;

  // Check if API key is missing
  if (!RAPID_API_KEY) {
    console.warn("RAPID_API_KEY is not defined. Check your .env file.");
  }

  const handleCodeChange = (value: string | undefined) => {
    setCode(value || "");
  };

  const updateCursorPosition = () => {
    if (!editorRef.current) return;
    const position = editorRef.current.getPosition();
    if (position) {
      setCursorPosition({ line: position.lineNumber, col: position.column });
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value || "javascript";
    setSelectedLanguage(newLanguage);
    setTerminalOutput("");

    // Set default code snippet for the selected language
    setCode(
      CODE_SNIPPETS[newLanguage as keyof typeof CODE_SNIPPETS]?.helloWorld || ""
    );
  };

  const onMount = (editor: any) => {
    if (!editor) return;
    editorRef.current = editor;
    editor.onDidChangeCursorPosition(updateCursorPosition);
    updateCursorPosition();
  };

  const runCode = async () => {
    setTerminalOutput("Executing code...");

    const languageMap: Record<string, { apiLang: string; ext: string }> = {
      javascript: { apiLang: "nodejs", ext: "js" },
      python: { apiLang: "python", ext: "py" },
      java: { apiLang: "java", ext: "java" },
      cpp: { apiLang: "cpp", ext: "cpp" },
    };

    const languageInfo =
      languageMap[selectedLanguage] || languageMap.javascript;
    const fileName = `test.${languageInfo.ext}`;

    const payload = {
      language: languageInfo.apiLang,
      stdin: "",
      files: [{ name: fileName, content: code }],
    };

    try {
      const response = await axios.post(
        "https://onecompiler-apis.p.rapidapi.com/api/v1/run",
        payload,
        {
          headers: {
            "X-RapidAPI-Key": RAPID_API_KEY,
            "X-RapidAPI-Host": "onecompiler-apis.p.rapidapi.com",
            "Content-Type": "application/json",
          },
        }
      );

      // Handle API response properly
      const output = response.data?.stdout
        ? response.data.stdout
        : response.data?.stderr
        ? `Error:\n${response.data.stderr}`
        : "No output received.";

      setTerminalOutput(output);
    } catch (error: any) {
      console.error(
        "Compilation Error:",
        error.response?.data || error.message
      );
      setTerminalOutput(
        `Error executing code:\n${
          error.response?.data?.stderr ||
          error.response?.data?.message ||
          error.message
        }`
      );
    }
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
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>
        <button
          className="bg-green-600 px-4 py-1 rounded text-sm hover:bg-green-700 transition-all duration-200 transform hover:scale-105"
          onClick={runCode}
        >
          Run
        </button>
      </div>
      <Editor
        value={code || ""}
        theme="vs-dark"
        defaultValue={
          CODE_SNIPPETS[selectedLanguage as keyof typeof CODE_SNIPPETS]
            ?.helloWorld || ""
        }
        className="w-full flex-1 bg-gray-800/30 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        onChange={handleCodeChange}
        onMount={onMount}
        language={selectedLanguage}
      />
      <div
        className="h-2 bg-gray-700 hover:bg-gray-600 cursor-row-resize transition-colors duration-200"
        onMouseDown={handleVerticalLeftMouseDown}
      />
    </div>
  );
}
