import axios from "axios";
import { LANGUAGE_VERSIONS } from "../constant/constant";

const RUN = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});

const EXPLAIN = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});

const DEBUG = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});

const CHAT = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
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

export const getExplanation = async (code: string) => {
  const response = "This is a test explanation";
  return response;
};

export const getDebugCode = async (code: string) => {
  const response = "This is a test debug code";
  return response;
};

export const getChatResponse = async (message: string, code: string) => {
  const response = "This is a test chat response";
  return response;
};
