import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext/AuthProvider';

const SignupPage = () => {
  const navigate = useNavigate();
  const { signupMutation, signupError } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    signupMutation(formData);
  };

  return (
    <div className='z-10 w-screen h-screen flex justify-center items-center bg-gradient-to-br from-black via-[#0a0a0a] to-[#12121e]'>
      <div className='flex flex-col gap-6 bg-[#12121e] text-white p-8 rounded-lg shadow-lg w-full max-w-sm'>
        <h3 className='text-center font-bold text-2xl'>Create Your Account</h3>

        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <input
            type='text'
            name='fullName'
            placeholder='Full Name'
            value={formData.fullName}
            onChange={handleChange}
            className='px-4 py-2 rounded-md bg-[#202332] text-white border border-gray-600 focus:outline-none placeholder-gray-400'
          />
          <input
            type='text'
            name='username'
            placeholder='Username'
            value={formData.username}
            onChange={handleChange}
            className='px-4 py-2 rounded-md bg-[#202332] text-white border border-gray-600 focus:outline-none placeholder-gray-400'
          />
          <input
            type='email'
            name='email'
            placeholder='Email'
            value={formData.email}
            onChange={handleChange}
            className='px-4 py-2 rounded-md bg-[#202332] text-white border border-gray-600 focus:outline-none placeholder-gray-400'
          />
          <input
            type='password'
            name='password'
            placeholder='Password'
            value={formData.password}
            onChange={handleChange}
            className='px-4 py-2 rounded-md bg-[#202332] text-white border border-gray-600 focus:outline-none placeholder-gray-400'
          />
          {signupError && <div className='text-red-600'>{signupError.message}</div>}

          <button
            type='submit'
            className='cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition mt-2'
          >
            Create Account
          </button>
        </form>

        <div className='text-sm text-center text-gray-300'>
          Already have an account?{' '}
          <Link to='/login' className='text-blue-600 font-semibold hover:underline'>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
