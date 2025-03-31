import { useEffect, useState } from 'react'
import { ai } from '../../Gemini/GoogleGenAI'

export function Recommendations() {
    const [recommendations, setRecommendations] = useState([]);

    type Selection = {
        id: string;
        artist: string;
        title: string;
        reason: string;
    }


    useEffect(() => {
        const gemini_api = async () => {
            const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });
            const response = await model.generateContent({
                contents: [{ role: "user", parts: [{ text: "Recommend me 15 songs based on what I listen to already: HOT by LE SSERAFIM, No Doubt by ENHYPEN, Supernova by aespa, Kick It by NCT 127. Can your response be only in json format of the list of recommended songs? And can you also add a reason. And can you add an id for each song?" }] }],
            });
            // const response = await ai.models.generateContent({
            //     model: 'gemini-2.0-flash',
            //     contents: 'You are a helpful AI providing music recommendations.',
            // });
            const res = await response?.response?.candidates?.[0]?.content?.parts?.[0]?.text;
            const newstr: string | undefined = res?.replace("json", "");
            const newstr2: string | undefined = newstr?.replace(/`/g, "");
            const listOfSongs = JSON.parse(newstr2 || "");
            console.log(listOfSongs);
            setRecommendations(listOfSongs);
        }
        gemini_api();
    }, []);


    return (
        <div className="background_color">
            <h1 style={{ color: "white", marginLeft: 'auto', marginRight: 'auto' }}>Google Gemini Recommended Songs!</h1>
            <h3 style={{ color: "white", marginLeft: 'auto', marginRight: 'auto' }} >The list was based on these songs that I listen to: HOT by LE SSERAFIM, No Doubt by ENHYPEN, Supernova by aespa, Kick It by NCT 127</h3>
            <ul>
                {recommendations?.map((item: Selection) =>
                    <li key={item.id} style={{ color: "white" }}>
                        <h4>{item.artist}: {item.title}</h4>
                        <p>{item.reason}</p>
                    </li>
                )}
            </ul>
        </div >
    )
}