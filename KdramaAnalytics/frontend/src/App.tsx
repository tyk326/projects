import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import './App.css'
import { Network } from './Network';


export function HomePage() {
  return (
    <div>
      <Link to="/NetworkGraph">Go Here</Link>
    </div>
  )
}


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/NetworkGraph' element={<Network />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
