import axios from "axios";
import { LANGUAGE_VERSIONS } from "../constant/constant";

const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});
type LanguageKey = keyof typeof LANGUAGE_VERSIONS;

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
