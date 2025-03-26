import './UserStats.css';
import { getToken, token } from '../../api/token'
import { user_id } from '../../../clientinfo'
import { useEffect, useState } from 'react';
import KakaoDuck from '../../assets/kakaoduck.png'
import KakaoHeart from '../../assets/kakaoheart.png'
import KakaoCouch from '../../assets/kakaocouch.jpeg'
import { Link } from 'react-router-dom';

type Profile = {
    display_name: string;
    followers: { total: number };
    images: { url: string }[];
}


export function UserStats() {
    let actualtoken: string = '';
    const [profileData, setProfile] = useState<Profile | undefined>(undefined);

    useEffect(() => {
        const getProfile = async () => {
            try {
                if (token.length === 0) {
                    actualtoken = await getToken();
                }
                else {
                    actualtoken = token;
                }
                const res = await fetch(`https://api.spotify.com/v1/users/${user_id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${actualtoken}`,
                    }
                });
                const data: Profile = await res.json();
                setProfile(data);
            }
            catch (err) {
                console.log(err);
            }
        }

        getProfile();
    }, []);



    return (
        <>
            <div className="background_color">
                <img src={profileData?.images[0].url} alt="Spotify Profile Picture" className='profilePic' />
                <h3 className='name'>UserName: {profileData?.display_name}</h3>
                <p className='total_followers'>Followers: {profileData?.followers.total}</p>
                <div className='LinkImgOptions'>
                    <img src={KakaoHeart} alt='KakaoHeart' className='KakaoImg' />
                    <img src={KakaoDuck} alt='KakaoDuck' className='KakaoImg' />
                    <img src={KakaoCouch} alt='KakaoCouch' className='KakaoImg' />
                </div>
                <div className='LinkOptions'>
                    <Link to='/PlaylistStats' className='texts'>Click Here for Playlist Analytics</Link>
                    <Link to='/Recommendations' className='texts'>Click Here for Recommendations</Link>
                    <Link to='/PlaySongs' className='texts'>Click Here to Play Music</Link>
                </div>
            </div>
        </>
    )
}