import axios from "axios";
import { LANGUAGE_VERSIONS } from "../constant/constant";

const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});
export type LanguageKey = keyof typeof LANGUAGE_VERSIONS;

export const executeCode = async (
  language: LanguageKey,
  sourceCode: string
) => {
  const response = await API.post("/execute", {
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

export const getExplanation = async (language: LanguageKey, code: string) => {
  const response = await API.post("/explain", {
    language: language,
    version: LANGUAGE_VERSIONS[language],
    files: [
      {
        content: code,
      },
    ],
  });
  console.log(response.data);
  return response.data;
};
