import { GoogleGenAI } from "@google/genai";
import { GoogleGenAI_API_KEY } from "../../clientinfo";

export const ai = new GoogleGenAI({apiKey: GoogleGenAI_API_KEY});
