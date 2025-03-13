import { useIdeContext } from "../context/IDEContext";

export default function Explanation() {
  const { explanation, setExplanation, chatHeight } = useIdeContext();

  const fetchExplanation = async () => {
    try {
      setExplanation("This is a test explanation");
    } catch (error) {
      setExplanation("Error fetching explanation");
      console.log(error);
    }
  };

  return (
    <div
      className="explain flex flex-col"
      style={{ height: `${100 - chatHeight}%` }}
    >
      <div className="head p-3 bg-gray-800/70 flex justify-between">
        <h2 className="text-lg font-semibold">Explanation</h2>
        <button
          className="bg-blue-600 px-4 py-1 rounded text-sm hover:bg-blue-700 transition-all duration-200"
          onClick={fetchExplanation}
        >
          Get Explanation
        </button>
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
