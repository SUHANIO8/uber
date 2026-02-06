
import React from 'react'
import { Link } from 'react-router-dom'

const Start = () => {
  return (
    <div className='h-screen w-full'>
      <div className='bg-cover bg-center bg-[url(https://images.unsplash.com/photo-1619059558110-c45be64b73ae?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] h-screen pt-8 sm:pt-12 md:pt-16 flex justify-between flex-col w-full'>
        <img className='w-12 sm:w-16 ml-4 sm:ml-8 mt-4 sm:mt-6' src="https://cdn-assets-eu.frontify.com/s3/frontify-enterprise-files-eu/eyJwYXRoIjoid2VhcmVcL2ZpbGVcLzhGbTh4cU5SZGZUVjUxYVh3bnEyLnN2ZyJ9:weare:F1cOF9Bps96cMy7r9Y2d7affBYsDeiDoIHfqZrbcxAw?width=1200&height=417" alt="Uber Logo" />
        <div className='bg-white pb-6 sm:pb-8 py-6 px-6 sm:px-8 md:px-10 mx-4 sm:mx-6 md:mx-8 rounded-t-2xl shadow-lg'>
          <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-gray-800'>Get Started with Uber</h2>
          <p className='text-sm sm:text-base text-gray-600 mb-6'>Experience seamless rides with our reliable service.</p>
          <Link to='/login' className='flex items-center justify-center w-full bg-black text-white py-4 rounded-xl mt-4 hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 shadow-md'>Continue</Link>
        </div>
      </div>
    </div>
  )
}

export default Start
