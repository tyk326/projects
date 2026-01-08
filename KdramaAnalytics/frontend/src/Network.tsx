import { useState, useEffect } from "react";

interface networkInfo {
    rank: string;
    title: string;
    actors: string[];
}

interface fetchedInfo {
    rank: string;
    title: string;
    actors: string;
}


export function Network() {
    const [info, setInfo] = useState<fetchedInfo[]>([]);
    const [actualInfo, setActualInfo] = useState<networkInfo[]>([]);
 




    const fixActors = () => {
        for (let i = 0; i < info.length; i++) {
            const actors = info[i].actors;
            const listActors: string[] = actors.split(",");
            const networkinfo: networkInfo = { "rank": info[i].rank.replace("#", ""), "title": info[i].title, "actors": listActors }
            setActualInfo(prev => [...prev, networkinfo])
        }
    };


    useEffect(() => {
        const info = async () => {
            const response = await fetch("http://127.0.0.1:5000/network", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const res = await response.json();
            setInfo(res);
        }
        info();
    }, []);

    useEffect(() => {
        if (info.length > 0) {
            fixActors();
        }
    }, [info]);

    return (
        <div>
            <div style={{ color: "2px solid blue" }}>
                
            </div>
            <ul>
                {actualInfo.map((item: networkInfo, index) => (
                    <li key={index}>
                        {item.rank} {item.title}
                        {item.actors.map((actor, actorIndex) => (
                            <span key={actorIndex}>{actor}</span>
                        ))}
                    </li>
                ))}
            </ul>
        </div>
    )
}