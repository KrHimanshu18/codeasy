interface StatusBarProps {
  cursorPosition: { line: number; col: number };
  selectedLanguage: string;
}

export default function StatusBar({
  cursorPosition,
  selectedLanguage,
}: StatusBarProps) {
  return (
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
  );
}
