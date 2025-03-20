import { token } from '../api/token'
import { user_id } from '../../clientinfo'
import { useEffect, useState } from 'react';

type Playlist = {
    id: string;
    name: string;
}

export function AllPlaylists(){
    const [listData, setData] = useState([]);

    useEffect(() => {
        const getPlaylists = async () => {
            try{
                const res = await fetch(`https://api.spotify.com/v1/users/${user_id}/playlists`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                const data = await res.json();
                console.log(data.items);
                setData(data.items);
            }   
            catch (err){
                console.log(err);
            }
        }
        getPlaylists();
    }, []);
    
    return(
        <>
            <h1>Playlists:</h1>
            <ul>
                {listData?.map((item: Playlist) => (
                    <li key={item.id}>{item.name}</li>
                ))}
            </ul>
        </>
    )
}