interface TerminalProps {
  terminalOutput: string;
  editorHeight: number;
}

export default function Terminal({
  terminalOutput,
  editorHeight,
}: TerminalProps) {
  return (
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
  );
}
