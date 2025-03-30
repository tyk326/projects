import './App.css'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import logo from './assets/name_logo.jpg'
import options_pic from './assets/playlist_options.avif'
import { getToken } from './api/token'
import { useEffect, useState } from 'react'
import { UserStats } from './analytics/UserProfile/UserStats'
import { AllPlaylists } from './analytics/AllPlaylists/AllPlaylists'
import { Recommendations } from './analytics/Recommendations/Recommendations'

function HomePage() {
  const navigate = useNavigate();
  const [proceed, setProceed] = useState(false);

  useEffect(() => {
    const callToken = async () => {
      const token = await getToken();
      if (token.length !== 0) {
        setProceed(true);
      }
    }
    callToken();
  }, []); //this hook runs once

  const goToURL = () => {
    navigate('/UserProfile');
  }

  return (
    <div className='intro_container'>
      <img src={logo} alt='Spotify Logo' style={{ marginTop: '30px', borderRadius: '110px', width: '500px', height: '280px', boxShadow: '0px 0px 20px 4px white' }} />
      <img src={options_pic} alt='Playlist Options' style={{ marginTop: '30px', borderRadius: '5px', width: '960px', height: '455px', boxShadow: '0px 0px 10px 0px white' }} />
      <div className='MidIntroPage'>
        <div className='title'>
          <h1 style={{ marginBottom: '45px', marginTop: '50px', fontSize: '100px', color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.6)', borderRadius: '20px', boxShadow: '0px 0px 20px 4px black' }}>Spotilytics</h1>
          <h3 style={{ marginBottom: '25px', fontSize: '25px', color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.6)', borderRadius: '20px', boxShadow: '0px 0px 20px 4px black' }}>All Your Music Trends In One Place</h3>
          {proceed && <button onClick={goToURL} style={{ marginTop: '10px', borderRadius: '20px', border: 'none', width: '60%', height: '30px', boxShadow: '0px 0px 20px 4px black' }}>Click Here To Proceed</button>}
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/UserProfile' element={<UserStats />} />
        <Route path='/PlaylistStats' element={<AllPlaylists />} />
        <Route path='/Recommendations' element={<Recommendations />} />
      </Routes>
    </Router>
  )
}

export default App
