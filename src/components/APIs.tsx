import axios from "axios";
import { LANGUAGE_VERSIONS } from "../constant/constant";

const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`;

const RUN = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});

const EXPLAIN = axios.create({
  baseURL: GEMINI_URL,
});

const DEBUG = axios.create({
  baseURL: GEMINI_URL,
});

const CHAT = axios.create({
  baseURL: GEMINI_URL,
});

export type LanguageKey = keyof typeof LANGUAGE_VERSIONS;

export const executeCode = async (
  language: LanguageKey,
  sourceCode: string
) => {
  const response = await RUN.post("/execute", {
    language: language,
    version: LANGUAGE_VERSIONS[language],
    files: [
      {
        content: sourceCode,
      },
    ],
  });
  console.log(response.data);
  return response.data;
};

export const getExplanation = async (code: string, language: string) => {
  const response = await EXPLAIN.post("", {
    contents: [
      {
        parts: [
          {
            text: "",
          },
        ],
      },
    ],
  });

  const aiResponse = "";

  return aiResponse;
};

export const getDebugCode = async (
  code: string,
  language: string,
  terminalOutput: string
) => {
  const response = await DEBUG.post("", {
    contents: [
      {
        parts: [
          {
            text: "",
          },
        ],
      },
    ],
  });

  const aiResponse = "";

  return aiResponse;
};

export const getChatResponse = async (message: string, code: string) => {
  const response = await CHAT.post("", {
    contents: [
      {
        parts: [
          {
            text: "",
          },
        ],
      },
    ],
  });

  const aiResponse = "";

  return aiResponse;
};
