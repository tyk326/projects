import './App.css'
import {BrowserRouter as Router, Routes, Route, useNavigate} from 'react-router-dom'
import logo from './assets/name_logo.jpg'
import { AllPlaylists } from './analytics/allPlaylists'

function HomePage(){
  const navigate = useNavigate();

  const goToURL = () => {
    navigate('/analytics');
  }

  return(
    <div className='intro_container'>
      <img src={logo} alt='Spotify Logo' style={{marginTop: '30px', borderRadius: '110px', width: '500px', height: '280px', boxShadow: '0px 0px 25px 0px'}}/>
      <div className='intro_page'>
          <h1 style={{marginBottom: '45px', fontSize: '60px'}}>Spotilytics</h1>
          <h3>All Your Music Trends In One Place</h3>
          <button onClick={goToURL}>Click Here To Proceed</button>
      </div>
      <p style={{marginTop: '260px'}}>By: Tyler</p>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/analytics' element={<AllPlaylists/>}/>
      </Routes>
    </Router>
  )
}

export default App
