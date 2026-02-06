import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'

const UserSignup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const { user, setUser } = useContext(UserDataContext)

  const submitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const newUser = {
      fullname: {
        firstname: firstName,
        lastname: lastName
      },
      email: email,
      password: password
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser)

      if (response.status === 201) {
        const data = response.data
        setUser(data.user)
        localStorage.setItem('token', data.token)
        navigate('/home')
      }
    } catch (error) {
      setError('Signup failed. Please try again.')
      console.error('Signup failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='h-screen w-full bg-gray-50'>
      <div className='p-6 sm:p-8 md:p-10 h-screen flex flex-col justify-between'>
        <div className='max-w-md mx-auto w-full'>
          <img className='w-14 sm:w-16 mb-8 mx-auto' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s" alt="Uber Logo" />

          <form onSubmit={(e) => submitHandler(e)} className='space-y-6'>
            <div>
              <h3 className='text-lg sm:text-xl font-semibold mb-3 text-gray-800'>What's your name</h3>
              <div className='flex flex-col sm:flex-row gap-4'>
                <input
                  required
                  className='bg-white border border-gray-300 rounded-xl px-5 py-3 w-full sm:w-1/2 text-base sm:text-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200'
                  type="text"
                  placeholder='First name'
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                  required
                  className='bg-white border border-gray-300 rounded-xl px-5 py-3 w-full sm:w-1/2 text-base sm:text-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200'
                  type="text"
                  placeholder='Last name'
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

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
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
          <p className='text-center text-sm sm:text-base mt-6 text-gray-600'>Already have an account? <Link to='/login' className='text-blue-600 hover:underline font-medium'>Login here</Link></p>
        </div>
        <div className='max-w-md mx-auto w-full'>
          <p className='text-xs leading-tight text-gray-500 text-center'>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy Policy</span> and <span className='underline'>Terms of Service apply</span>.</p>
        </div>
      </div>
    </div>
  )
}

export default UserSignup
