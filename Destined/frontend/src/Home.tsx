import { Button } from '@mantine/core'
import { useContext, useState } from 'react'
import axios from 'axios'
import { PlaceFeature, UserContext } from './ContextProvider'
import { Title } from './Title'
import { useNavigate } from 'react-router-dom'


// home page
export function Home() {
  const { address, setAddress, setPlaces } = useContext(UserContext)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // post request to backend
  const handleClick = () => {
    setLoading(true)
    axios.post("http://127.0.0.1:5000/", {
      "address": address,
    })
      .then((response) => {
        if (response.data.message === 'OK') {
          // filter out the places with no names
          const withNames: PlaceFeature[] = response.data.places.filter((place: PlaceFeature) => place.properties.name);
          setPlaces(withNames);
          console.log("Successfully retrieved places for new address");
          navigate(`/overview/`);
        }
      })
      .catch((e) => console.log(e))
  }

  return (
    <>
      <Title />
      <div className='mt-16 bg-[#ff9797] text-center py-45'>
        <h1 className='text-5xl font-bold'>Decide Your Plans Without Thinking Too Hard</h1>
        <p className='text-xl mt-5'>Choose and Go</p>
      </div>
      <div className='flex justify-center'>
        <div className='flex flex-col bg-[#e9e7e7] z-25 -mt-12 py-16 px-24 rounded-3xl shadow-xl shadow-[#ffb7c5] w-175 border-3'>
          <h2 className='text-2xl font-bold mb-5'>Enter Your Location</h2>
          <input
            placeholder='Type Address Here...(place, city, state, etc. 😅)'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className='border-2 border-gray-500 mb-2 text-md p-1.5 rounded-lg'
          />
          <Button loading={loading} onClick={() => handleClick()} className='bg-[#ff6e6e] mt-2 text-md p-1.5'>
            Submit Location
          </Button>
        </div>
      </div>
      <div className='bg-[#f3f0f0] text-center py-16 px-28'>
        <h2 className='text-3xl font-semibold mb-7'>About Destined</h2>
        <p>
          Destined is your personal location solution. We make it easy for you to decide where you want to go and have fun.
        </p>
        <p>
          Whether you're planning a day trip with your friends or don't know where to go eat, Destined keeps everything organized and accessible.
        </p>
        <p>
          Our mission is to provide a seamless way to pick a spot and go.
        </p>
      </div>
      <div className='bg-linear-to-r from-[#f88a8a] to-[#f86060] text-center py-12'>
        <h3 className='text-xl text-white font-bold mb-2'>Ready to Get Started?</h3>
        <p className='text-white'>&copy; 2025 Destined. All rights reserved.</p>
      </div>
    </>
  )
}