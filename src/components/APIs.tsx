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
            text: `You are an expert programmer with advanced knowledge of multiple programming languages. Analyze the code "${code}" in "${language}" and provide a brief explanation in plain text. Break it down line-by-line, explaining what each line does in simple terms. Keep it concise, avoid unnecessary details, and use this format: "Line <number>: <explanation>". If the code has errors or can be optimized, note it briefly. Do not generate code unless asked. Ensure the response is accessible via console.log(response.data.candidates?.[0]?.content?.parts?.[0]?.text) and the response should be in plain text.`,
          },
        ],
      },
    ],
  });
  const aiResponse =
    response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "No explanation provided.";
  console.log(aiResponse);
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
            text: `You are an expert programmer. Here’s ${language} code with an issue:\n\`\`\`\n${code}\n\`\`\`\nConsole Output/Error:\n\`\`\`\n${terminalOutput}\n\`\`\`\nProvide only the corrected code without any extra text, explanations, or language identifiers, within a \`\`\` block. Format your response as:\n\`\`\`\n<corrected code>\n\`\`\` `,
          },
        ],
      },
    ],
  });
  const aiResponse =
    response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "No correction provided.";
  const codeMatch = aiResponse.match(/```[\s\S]*?```/); // Extract content between ```
  const correctedCode = codeMatch
    ? codeMatch[0].replace(/```/g, "").trim()
    : aiResponse; // Remove ``` and trim
  console.log("Debug response:", aiResponse); // For debugging
  return correctedCode; // Return only the corrected code
};

export const getChatResponse = async (
  message: string,
  code: string,
  language: string
) => {
  const response = await CHAT.post("", {
    contents: [
      {
        parts: [
          {
            text: `You are an expert programmer. Based on the request: "${message}", and the previously written ${language} code: "${code}", provide an answer or generate ${language} code to accomplish the task if requested. If code is generated, provide only the code without language identifiers, within a \`\`\` block, with no explanations. If the request is a question, provide a concise plain text answer.`,
          },
        ],
      },
    ],
  });
  const aiResponse =
    response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "No response generated.";
  const codeMatch = aiResponse.match(/```[\s\S]*?```/); // Check if it’s a code block
  const result = codeMatch
    ? codeMatch[0].replace(/```/g, "").trim()
    : aiResponse; // Extract code or return plain answer
  console.log("Chat response:", aiResponse); // For debugging
  return result; // Return either the generated code or the answer
};
