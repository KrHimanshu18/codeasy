import axios from "axios";
import { LANGUAGE_MAP } from "../constant/constant";

const COMPILER_KEY = import.meta.env.VITE_COMPILER_KEY;
const COMPILER_URL = `https://onecompiler.com/api/v1/run?access_token=${COMPILER_KEY}`;

export type LanguageKey = keyof typeof LANGUAGE_MAP;

export const executeCode = async (
  language: LanguageKey,
  sourceCode: string
) => {
  return "";
};
