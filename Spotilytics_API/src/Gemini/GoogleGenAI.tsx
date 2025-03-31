import { GoogleGenAI } from "@google/genai";
import { GoogleGenAI_API_KEY } from "../../clientinfo";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const ai = new GoogleGenerativeAI(GoogleGenAI_API_KEY);
