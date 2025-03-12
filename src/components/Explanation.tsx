interface ExplanationProps {
  explanation: string;
  chatHeight: number;
}

export default function Explanation({
  explanation,
  chatHeight,
}: ExplanationProps) {
  return (
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
  );
}
