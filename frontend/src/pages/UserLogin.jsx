import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const UserLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { user, setUser } = useContext(UserDataContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true)
    setError('')

    const userData = {
      email: email,
      password: password
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData)

      if (response.status === 200) {
        const data = response.data
        setUser(data.user)
        localStorage.setItem('token', data.token)
        navigate('/home')
      }
    } catch (error) {
      setError('Login failed. Please check your credentials.')
      console.error('Login failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='p-6 sm:p-8 md:p-10 h-screen flex flex-col justify-between bg-gray-50'>
      <div className='max-w-md mx-auto w-full'>
        <img className='w-14 sm:w-16 mb-8 mx-auto' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s" alt="Uber Logo" />

        <form onSubmit={(e) => submitHandler(e)} className='space-y-6'>
          <div>
            <h3 className='text-lg sm:text-xl font-semibold mb-3 text-gray-800'>What's your email</h3>
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='bg-white border border-gray-300 rounded-xl px-5 py-3 w-full text-base sm:text-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200'
              type="email"
              placeholder='email@example.com'
            />
          </div>

          <div>
            <h3 className='text-lg sm:text-xl font-semibold mb-3 text-gray-800'>Enter Password</h3>
            <input
              className='bg-white border border-gray-300 rounded-xl px-5 py-3 w-full text-base sm:text-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              placeholder='password'
            />
          </div>

          {error && <p className='text-red-500 text-sm text-center'>{error}</p>}

          <button
            disabled={loading}
            className='bg-black text-white font-bold py-4 px-6 rounded-xl w-full text-lg hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className='text-center text-sm sm:text-base mt-6 text-gray-600'>New here? <Link to='/signup' className='text-blue-600 hover:underline font-medium'>Create new Account</Link></p>
      </div>
      <div className='max-w-md mx-auto w-full'>
        <Link
          to='/captain-login'
          className='bg-green-600 flex items-center justify-center text-white font-bold py-4 px-6 rounded-xl w-full text-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg'
        >
          Sign in as Captain
        </Link>
      </div>
    </div>
  )
}

export default UserLogin
