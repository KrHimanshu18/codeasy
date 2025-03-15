import axios from "axios";
import { LANGUAGE_MAP } from "../constant/constant";

const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY;
const COMPILER_KEY = import.meta.env.VITE_COMPILER_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`;
const COMPILER_URL = `https://onecompiler.com/api/v1/run?access_token=${COMPILER_KEY}`;

export type LanguageKey = keyof typeof LANGUAGE_MAP;

export const executeCode = async (
  language: LanguageKey,
  sourceCode: string
) => {
  return "";
};

export const getExplanation = async (code: string, language: LanguageKey) => {
  return "";
};

export const getDebugCode = async (
  code: string,
  language: LanguageKey,
  terminalOutput: string
) => {
  return "";
};

export const getChatResponse = async (
  message: string,
  code: string,
  language: LanguageKey
) => {
  return "";
};
