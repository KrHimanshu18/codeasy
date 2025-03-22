import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const debugCodeAiModel = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: '"console.log("This is the printing text"" : :You are an experienced coder with an excellent knowledge of data structure and algorithms, various coding languages and are an excellent problem solver.\n-User want to debug his code\n-Analyze the provided code "" and generate the correct code\n-Output will be ARRAY of String in JSON format only\n-Do not add any plane text in output',
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n[\n  "console.log(\\"This is the printing text\\");"\n]\n```',
        },
      ],
    },
    {
      role: "user",
      parts: [
        {
          text: '"console.log("This is the printing text"" : :You are an experienced coder with an excellent knowledge of data structure and algorithms, various coding languages and are an excellent problem solver.\n-User want to debug his code\n-Analyze the provided code "" and generate the correct code\n-Output will be ARRAY of String in JSON format only\n-The output will be in format output : "output"\n-Do not add any plane text in output',
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n{\n  "output": [\n    "console.log(\\"This is the printing text\\");"\n  ]\n}\n```',
        },
      ],
    },
  ],
});

export const explainAiModel = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: '"console.log("This is the printing text")" : :You are an experienced coder with an excellent knowledge of data structure and algorithms, various coding languages and are an excellent problem solver.\n-User want to get a  brief explanation his code\n-Analyze the provided code and generate the explanation of the code as briefly as possible\n-Output will be ARRAY of String in JSON format only\n-Do not add any plane text in output',
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n[\n  "This line of code uses the `console.log()` function.",\n  "`console.log()` is a JavaScript function used to display output in the console.",\n  "The text `\\"This is the printing text\\"` is the argument passed to the function.",\n  "Therefore, this code will print the string \\"This is the printing text\\" to the console."\n]\n```',
        },
      ],
    },
    {
      role: "user",
      parts: [
        {
          text: '"console.log("This is the printing text")" : :You are an experienced coder with an excellent knowledge of data structure and algorithms, various coding languages and are an excellent problem solver.\n-User want to get a  brief explanation his code\n-Analyze the provided code and generate the explanation of the code as briefly as possible\n-The explanation of a line should not exceed 15 words\n-Output will be ARRAY of String in JSON format only\n-Do not add any plane text in output',
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n[\n  "This line uses the `console.log()` function to print output.",\n  "`console.log()` displays information in the browser\'s console.",\n  "The string \\"This is the printing text\\" will be printed.",\n  "Essentially, this code prints a message to the console."\n]\n```',
        },
      ],
    },
    {
      role: "user",
      parts: [
        {
          text: '"console.log("This is the printing text")" : :You are an experienced coder with an excellent knowledge of data structure and algorithms, various coding languages and are an excellent problem solver.\n-User want to get a  brief explanation his code\n-Analyze the provided code and generate the explanation of the code as briefly as possible\n-The explanation should not be more than (number of lines in code * 15) words\n-Output will be ARRAY of String in JSON format only\n-Do not add any plane text in output',
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n[\n  "This code uses `console.log()` to display text.",\n  "It will print \\"This is the printing text\\" to the console."\n]\n```',
        },
      ],
    },
  ],
});

export const chatBotAiModel = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: '"define react" : :You are an experienced coder with an excellent knowledge of data structure and algorithms, various coding languages and are an excellent problem solver.\n-User want to get solution of a problem\n-Analyze the provided description and generate the solution for the asked question/doubt\n-The explanation should be as short as possible\n-Output will be ARRAY of String in JSON format only\n-Do not add any plane text in output\n',
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n[\n  "React is a JavaScript library for building user interfaces.",\n  "It uses a component-based architecture.",\n  "React employs a virtual DOM for efficient updates.",\n  "It follows a declarative programming paradigm.",\n  "React is maintained by Facebook and a community of developers."\n]\n```',
        },
      ],
    },
  ],
});
