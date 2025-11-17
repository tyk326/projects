import { Paper, TextInput } from '@mantine/core'
import { useState } from 'react'

// home page
function App() {
  return (
    <>
      <div className='fixed w-full top-0 z-50 bg-linear-to-r from-[#f88a8a] to-[#f86060] px-8 py-4 shadow-lg'>
        <p className='text-white font-bold text-3xl'>PianoQuery</p>
      </div>
      <div className='mt-16 bg-[#ff9797] text-center py-45'>
        <h1 className='text-5xl font-bold'>Convert Piano Music to Sheets Effortlessly</h1>
        <p className='text-xl mt-5'>Upload, organize, and download piano sheets all in one place</p>
      </div>
      <div className='flex justify-center'>
        <div className='flex flex-col bg-[#f3f0f0] z-50 -mt-12 py-16 px-24 rounded-3xl shadow-xl shadow-[#ffb7c5] w-175 border-3'>
          <h2 className='text-2xl font-bold mb-5'>Upload Your Link</h2>
          <input 
            placeholder='Link title'
            className='border-2 border-gray-500 mb-2 text-md p-1.5 rounded-lg'
          />
          <input 
            placeholder='Enter your URL (e.g., https://example.com)'
            className='border-2 border-gray-500 text-md p-1.5 rounded-lg'
          />
          <button className='bg-[#ff6e6e] mt-2 text-md p-1.5 rounded-lg'>
            Upload Link
          </button>
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

export default App