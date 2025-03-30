import { useEffect, useState } from 'react'
import { ai } from '../../Gemini/GoogleGenAI'
import { GoogleGenAI_API_KEY } from '../../../clientinfo';

export function Recommendations() {
    const [recommendations, setRecommendations] = useState<string | undefined>('');

    useEffect(() => {
        const gemini_api = async () => {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GoogleGenAI_API_KEY}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [{ role: "user", parts: [{ text: "Hi, here is my current list of songs: Mona Lisa by j-hope, HOT by LE SSERAFIM, KNOW ABOUT ME by NMIXX, and Kick It by NCT 127. Can you create a list of recommendations based on my taste in music from the list of given songs?" }] }],
                    config: {
                        maxOutputTokens: 1000,
                        systemInstruction: "You are a helpful AI providing music recommendations.",
                    },
                }),
            });
            const data = await response.json();
            setRecommendations(data.candidates?.[0]?.content?.parts?.[0]?.text);
        }
        gemini_api();
    }, []);


    return (
        <div className="background_color">
            <h4>{recommendations}</h4>
        </div>
    )
}