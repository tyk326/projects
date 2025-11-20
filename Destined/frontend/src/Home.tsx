import { Button } from '@mantine/core'
import { useContext, useState } from 'react'
import axios from 'axios'
import { UserContext } from './ContextProvider'
import { Title } from './Title'
import { useNavigate } from 'react-router-dom'


// home page
export function Home() {
  const { title, link, setTitle, setLink } = useContext(UserContext)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // post request to backend. send title and link
  const handleClick = () => {
    setLoading(true)
    axios.post("http://127.0.0.1:5000/", {
      "title": title,
      "link": link,
    })
      .then((response) => {
        if (response.data.message === 'OK'){
          navigate(`/sheet/`)
        }
      })
      .catch((e) => console.log(e))
  }

  return (
    <>
      <Title />
      <div className='mt-16 bg-[#ff9797] text-center py-45'>
        <h1 className='text-5xl font-bold'>Convert Youtube Piano Music to Sheets Effortlessly</h1>
        <p className='text-xl mt-5'>Upload, organize, and download piano sheets all in one place</p>
      </div>
      <div className='flex justify-center'>
        <div className='flex flex-col bg-[#e9e7e7] z-25 -mt-12 py-16 px-24 rounded-3xl shadow-xl shadow-[#ffb7c5] w-175 border-3'>
          <h2 className='text-2xl font-bold mb-5'>Upload Your Link</h2>
          <input
            placeholder='Link title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='border-2 border-gray-500 mb-2 text-md p-1.5 rounded-lg'
          />
          <input
            placeholder='Enter your URL (e.g., https://example.com)'
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className='border-2 border-gray-500 text-md p-1.5 rounded-lg'
          />
          <Button loading={loading} onClick={() => handleClick()} className='bg-[#ff6e6e] mt-2 text-md p-1.5'>
            Upload Link
          </Button>
        </div>
      </div>
      <div className='bg-[#f3f0f0] text-center py-16 px-28'>
        <h2 className='text-3xl font-semibold mb-7'>About PianoQuery</h2>
        <p>
          PianoQuery is your personal piano music sheet solution. We make it easy to convert recording links of your favorite piano songs into music sheets.
        </p>
        <p>
          Whether you're practicing for music, sharing music sheets with friends, or brainstorming possible projects, PianoQuery keeps everything organized and accessible.
        </p>
        <p>
          Our mission is to provide a easy way to create piano music sheets from any recording.
        </p>
      </div>
      <div className='bg-linear-to-r  from-[#f88a8a] to-[#f86060] text-center py-12'>
        <h3 className='text-xl text-white font-bold mb-2'>Ready to Get Started?</h3>
        <p className='text-white'>&copy; 2025 PianoQuery. All rights reserved.</p>
      </div>
    </>
  )
}