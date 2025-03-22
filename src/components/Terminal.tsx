import { useIdeContext } from "../context/IDEContext";
import { debugCodeAiModel } from "../config.tsx/AiModel";
import Prompt from "../constant/prompt";

export default function Terminal() {
  const { terminalOutput, editorHeight, setCode, code } = useIdeContext();

  const debugCode = async () => {
    try {
      const prompt = code + Prompt.DEBUG;
      const aiResponse = await debugCodeAiModel.sendMessage(prompt);
      const responseText = await aiResponse.response.text();
      const correctCode = JSON.parse(responseText);
      console.log(correctCode[0]);

      setCode(correctCode[0]);
    } catch (error) {
      console.error("Error debugging code:", error);
    }
  };

  return (
    <div
      className="terminal flex flex-col"
      style={{ height: `${100 - editorHeight}%` }}
    >
      <div className="head p-3 bg-gray-800/70 flex justify-between">
        <h2 className="text-lg font-semibold">Terminal</h2>
        <button
          className="bg-blue-600 px-4 py-1 rounded text-sm hover:bg-blue-700 transition-all duration-200"
          onClick={debugCode}
        >
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
