import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  ReactNode,
} from "react";

interface IdeState {
  isDarkMode: boolean;
  chatInput: string;
  code: string;
  chatResponse: string;
  explanation: string;
  terminalOutput: string;
  leftWidth: number;
  editorHeight: number;
  chatHeight: number;
  cursorPosition: { line: number; col: number };
  selectedLanguage: string;
}

interface IdeContextType extends IdeState {
  setIsDarkMode: (value: boolean) => void;
  setChatInput: (value: string) => void;
  setCode: (value: string) => void;
  setChatResponse: (value: string) => void;
  setExplanation: (value: string) => void;
  setTerminalOutput: (value: string) => void;
  setLeftWidth: (value: number) => void;
  setEditorHeight: (value: number) => void;
  setChatHeight: (value: number) => void;
  setCursorPosition: (value: { line: number; col: number }) => void;
  setSelectedLanguage: (value: string) => void;
  handleChatSend: () => void;
  handleHorizontalMouseDown: () => void;
  handleVerticalLeftMouseDown: () => void;
  handleVerticalRightMouseDown: () => void;
  containerRef: React.RefObject<HTMLDivElement>;
  leftSectionRef: React.RefObject<HTMLDivElement>;
  rightSectionRef: React.RefObject<HTMLDivElement>;
}

const IdeContext = createContext<IdeContextType | undefined>(undefined);

export const useIdeContext = () => {
  const context = useContext(IdeContext);
  if (!context) {
    throw new Error("useIdeContext must be used within an IdeProvider");
  }
  return context;
};

export const IdeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const [code, setCode] = useState(`print("Hello world")`);
  const [chatResponse, setChatResponse] = useState("");
  const [explanation, setExplanation] = useState("");
  const [terminalOutput, setTerminalOutput] = useState("");
  const [leftWidth, setLeftWidth] = useState(60);
  const [editorHeight, setEditorHeight] = useState(60);
  const [chatHeight, setChatHeight] = useState(60);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, col: 1 });
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const containerRef = useRef<HTMLDivElement>(null!);
  const leftSectionRef = useRef<HTMLDivElement>(null!);
  const rightSectionRef = useRef<HTMLDivElement>(null!);
  const isResizingHorizontal = useRef(false);
  const isResizingVerticalLeft = useRef(false);
  const isResizingVerticalRight = useRef(false);

  const handleHorizontalMouseMove = (e: MouseEvent) => {
    if (!isResizingHorizontal.current || !containerRef.current) return;
    const container = containerRef.current;
    const containerWidth = container.getBoundingClientRect().width;
    const newLeftWidth =
      ((e.clientX - container.getBoundingClientRect().left) / containerWidth) *
      100;
    const constrainedWidth = Math.max(20, Math.min(80, newLeftWidth));
    setLeftWidth(constrainedWidth);
  };

  const handleHorizontalMouseUp = () => {
    isResizingHorizontal.current = false;
    document.removeEventListener("mousemove", handleHorizontalMouseMove);
    document.removeEventListener("mouseup", handleHorizontalMouseUp);
  };

  const handleHorizontalMouseDown = () => {
    isResizingHorizontal.current = true;
    document.addEventListener("mousemove", handleHorizontalMouseMove);
    document.addEventListener("mouseup", handleHorizontalMouseUp);
  };

  const handleVerticalLeftMouseMove = (e: MouseEvent) => {
    if (!isResizingVerticalLeft.current || !leftSectionRef.current) return;
    const container = leftSectionRef.current;
    const containerHeight = container.getBoundingClientRect().height;
    const newEditorHeight =
      ((e.clientY - container.getBoundingClientRect().top) / containerHeight) *
      100;
    const constrainedHeight = Math.max(20, Math.min(80, newEditorHeight));
    setEditorHeight(constrainedHeight);
  };

  const handleVerticalLeftMouseUp = () => {
    isResizingVerticalLeft.current = false;
    document.removeEventListener("mousemove", handleVerticalLeftMouseMove);
    document.removeEventListener("mouseup", handleVerticalLeftMouseUp);
  };

  const handleVerticalLeftMouseDown = () => {
    isResizingVerticalLeft.current = true;
    document.addEventListener("mousemove", handleVerticalLeftMouseMove);
    document.addEventListener("mouseup", handleVerticalLeftMouseUp);
  };

  const handleVerticalRightMouseMove = (e: MouseEvent) => {
    if (!isResizingVerticalRight.current || !rightSectionRef.current) return;
    const container = rightSectionRef.current;
    const containerHeight = container.getBoundingClientRect().height;
    const newChatHeight =
      ((e.clientY - container.getBoundingClientRect().top) / containerHeight) *
      100;
    const constrainedHeight = Math.max(20, Math.min(80, newChatHeight));
    setChatHeight(constrainedHeight);
  };

  const handleVerticalRightMouseUp = () => {
    isResizingVerticalRight.current = false;
    document.removeEventListener("mousemove", handleVerticalRightMouseMove);
    document.removeEventListener("mouseup", handleVerticalRightMouseUp);
  };

  const handleVerticalRightMouseDown = () => {
    isResizingVerticalRight.current = true;
    document.addEventListener("mousemove", handleVerticalRightMouseMove);
    document.addEventListener("mouseup", handleVerticalRightMouseUp);
  };

  const handleChatSend = () => {
    setChatResponse(`AI Response: ${chatInput}`);
    setExplanation(`Explanation: This is a response to "${chatInput}"`);
    setTerminalOutput(`Terminal: Processed "${chatInput}"`);
    setChatInput("");
  };

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleHorizontalMouseMove);
      document.removeEventListener("mouseup", handleHorizontalMouseUp);
      document.removeEventListener("mousemove", handleVerticalLeftMouseMove);
      document.removeEventListener("mouseup", handleVerticalLeftMouseUp);
      document.removeEventListener("mousemove", handleVerticalRightMouseMove);
      document.removeEventListener("mouseup", handleVerticalRightMouseUp);
    };
  }, []);

  const value = {
    isDarkMode,
    setIsDarkMode,
    chatInput,
    setChatInput,
    code,
    setCode,
    chatResponse,
    setChatResponse,
    explanation,
    setExplanation,
    terminalOutput,
    setTerminalOutput,
    leftWidth,
    setLeftWidth,
    editorHeight,
    setEditorHeight,
    chatHeight,
    setChatHeight,
    cursorPosition,
    setCursorPosition,
    selectedLanguage,
    setSelectedLanguage,
    handleChatSend,
    handleHorizontalMouseDown,
    handleVerticalLeftMouseDown,
    handleVerticalRightMouseDown,
    containerRef,
    leftSectionRef,
    rightSectionRef,
  };

  return <IdeContext.Provider value={value}>{children}</IdeContext.Provider>;
};
