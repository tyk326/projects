import { getToken, token } from '../../api/token'
import { user_id } from '../../../clientinfo'
import { useEffect, useState } from 'react';
import './AllPlaylists.css'

type Playlist = {
    id: string;
    name: string;
    images: { url: string }[];
    tracks: { total: number };
}

export function AllPlaylists() {
    const [listData, setData] = useState([]);
    let actualtoken: string = '';

    useEffect(() => {
        const getPlaylists = async () => {
            try {
                if (token.length === 0) { //when we refresh the screen, check if valid access token
                    actualtoken = await getToken();
                }
                else {
                    actualtoken = token;
                }

                const res = await fetch(`https://api.spotify.com/v1/users/${user_id}/playlists`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${actualtoken}`,
                    }
                });
                const data = await res.json();
                setData(data.items);
            }
            catch (err) {
                console.log(err);
            }
        }
        getPlaylists();
    }, []);


    //had to move this code for scrolling with buttons inside component because it needs to render with it
    const container = document.getElementById('scrollContainer');
    const scrollAmt: number = 550;
    const scrollLeft = () => {
        if (container) {
            container.scrollLeft -= scrollAmt;
        }
    }

    const scrollRight = () => {
        if (container) {
            container.scrollLeft += scrollAmt;
        }
    }


    return (
        <>
            <div className='background_color'>
                <h1 className='PlaylistTitle'>My Playlists:</h1>
                <ul className='name_pic_grouping' id='scrollContainer'>
                    {listData?.map((item: Playlist) => (
                        <li key={item.id}>
                            <div className='name_pic_pair'>
                                <div className='forHoverandPopup'>
                                    <img src={item.images[0].url} alt={item.name} className='MusicImages' />
                                    <div className='popup'>
                                        <p className='numberOfTracks'>There are {item.tracks.total} songs in this playlist!</p>
                                    </div>
                                </div>
                                <h4 style={{ color: 'white', marginBottom: '0px' }}>{item.name}</h4>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className='moveBtns'>
                    <button className='moveListBtn' onClick={scrollLeft}>⬅️</button>
                    <button className='moveListBtn' onClick={scrollRight}>➡️</button>
                </div>
            </div>
        </>
    )
}