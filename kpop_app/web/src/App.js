import './App.css';
import Lmf from './lyrics_page/lmf'; //use pascal case when importing
import Candy from './lyrics_page/candy';
import React from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';

const handleClick = () => {
  console.log('clicked!');
};

function Home() { //handles main page content that is rendered when user navigates to "/" path
  const [value, setValue] = useState("");

  return (
    <div>
      <h1 className="home_title"><Link to="/" style={{ textDecoration: 'none' }}>Korean Music Lyrics</Link></h1>
      <div className="introduction_message">
        <h3>Below Contains a list of songs with English and Korean translations</h3>
        <p>Pick any song to vibe to!</p>
        <p>Scroll down to add a song suggestion!</p>
      </div>
      <div className="selections">
        <div className="songs_with_pics">
          <p><b><span style={{ fontSize: '20px' }}>LOVE, MONEY, FAME</span></b> by Seventeen</p>
          <p><span style={{ fontSize: '12px' }}><Link to="love-money-fame" style={{ textDecoration: 'none' }}>---{'>'} Click here for lyrics</Link></span></p> {/* link has to match route */}
          <img src="/seventeen_picture.jpeg" className="song_picture" />
        </div>
        <div className="songs_with_pics">
          <p><b><span style={{ fontSize: '20px' }}>Candy</span></b> by Seventeen</p>
          <p><span style={{ fontSize: '12px' }}><Link to="/candy" style={{ textDecoration: 'none' }}>---{'>'} Click here for lyrics</Link></span></p>
          <img src="/seventeen_picture.jpeg" className="song_picture" />
        </div>
      </div>
      <div className="submit_form">
        <input type="text" placeholder="Give me a song to add!" className="song_idea" value={value} onChange={(e) => setValue(e.target.value)} />
        <button className="btn" onClick={handleClick}>Submit</button>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Helmet>
        <meta charSet='utf-8' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <title>List of Favorite Things</title>
        <link rel='stylesheet' type='text/css' href='./App.css' />
        <style>{`
          a:link { color: black; }
          a:visited { color: black; }
          a:hover { color: black; }
          a:active { color: black; }
        `}</style>
      </Helmet>
      {/* Define Routes */}
      <Routes>
        <Route path="/love-money-fame" element={<Lmf />} />
        <Route path="/candy" element={<Candy />} />
        <Route path="/" element={<Home />} /> {/* To avoid nesting App component itself, we use Home */}
      </Routes>
    </Router>
  );
}

export default App;
