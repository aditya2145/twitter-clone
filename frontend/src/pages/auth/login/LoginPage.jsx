// import React, { useState } from 'react'
// import '../signup/SignupPage.css'
// import { useNavigate, Link } from 'react-router-dom'
// import { useAuth } from '../../../context/AuthContext/AuthProvider';
 
// const LoginPage = () => {
//   const { login, loginError } = useAuth();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//   });

//   const handleChange = (e) => {
//     setFormData({...formData, [e.target.name]: e.target.value})
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     login(formData);
//   }

//   return (
//     <div className='z-10 w-screen h-screen flex justify-center items-center bg-gradient-to-br from-[#080808] via-[#121723] to-[#0f1822]'>
//       <div className='flex flex-col gap-6 bg-[#202332] text-white p-8 rounded-lg shadow-lg w-full max-w-sm'>
//         <h3 className='text-center font-bold text-2xl'>Login</h3>

//         <div className='flex flex-col gap-4'>
//           <input
//             name='username'
//             onChange={handleChange}
//             className='px-4 py-2 rounded-md bg-[#202332] text-white border border-gray-600 focus:outline-none placeholder-gray-400'
//             type="text"
//             placeholder='Enter your username'
//           />
//           <input
//             name='password'
//             onChange={handleChange}
//             className='px-4 py-2 rounded-md bg-[#202332] text-white border border-gray-600 focus:outline-none placeholder-gray-400'
//             type="password"
//             placeholder='Enter your password'
//           />
//           <div className='text-red-600'>{loginError? loginError : ''}</div>
//           <button onClick={handleSubmit} className='cursor-pointer bg-[#4c4c96] hover:bg-[#363669] text-white font-semibold py-2 rounded-md transition'>
//             Login
//           </button>
//         </div>

//         <div className='text-sm text-center text-gray-300'>
//           Don't have an account?{' '}
//           <Link to='/signup' className='text-[#5454a5] font-semibold hover:underline'>
//             Signup
//           </Link>
//         </div>
//       </div>
//     </div>
//     // <div className='w-full h-full flex justify-center items-center'>
//     //   <div className='w-[30rem] p-[1rem] bg-[#242D34] flex flex-col gap-6'>
//     //     <h2 className='font-bold text-xl text-center'>Sign in</h2>
//     //     <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
//     //       <div className='flex flex-col gap-4'>
//     //         <input name='username' onChange={handleChange} type="text" placeholder='Enter Username' />
//     //         <input name='password' onChange={handleChange} type="password" placeholder='Enter Password' />
//     //         {loginError && <div className='text-red-600'>{loginError.message}</div>}
//     //       </div>
//     //       <button className='btn' type='submit'>Log in</button>
//     //     </form>

//     //     <div className='flex flex-col gap-3.5'>
//     //       <h3 className='font-bold'>Don't have an account?</h3>
//     //       <button onClick={() => navigate('/signup')} className='btn'>Sign up</button>
//     //     </div>
//     //   </div>
//     // </div>
//   )
// }

// export default LoginPage

import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext/AuthProvider';

const LoginPage = () => {
  const { login, loginError } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  }

  return (
    <div className='z-10 w-screen h-screen flex justify-center items-center bg-gradient-to-br from-black via-[#0a0a0a] to-[#12121e]'>
      <div className='flex flex-col gap-6 bg-[#12121e] text-white p-8 rounded-lg shadow-xl w-full max-w-sm'>
        <h3 className='text-center font-bold text-2xl'>Login</h3>

        <div className='flex flex-col gap-4'>
          <input
            name='username'
            onChange={handleChange}
            className='px-4 py-2 rounded-md bg-[#1e1e2f] text-white border border-[#33334d] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400'
            type="text"
            placeholder='Enter your username'
          />
          <input
            name='password'
            onChange={handleChange}
            className='px-4 py-2 rounded-md bg-[#1e1e2f] text-white border border-[#33334d] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400'
            type="password"
            placeholder='Enter your password'
          />
          <div className='text-red-500 min-h-[1.25rem]'>
            {loginError ? loginError : ''}
          </div>
          <button 
            onClick={handleSubmit} 
            className='cursor-pointer bg-blue-600 hover:bg-blue-700  text-white font-semibold py-2 rounded-md transition'
          >
            Login
          </button>
        </div>

        <div className='text-sm text-center text-gray-400'>
          Don&apos;t have an account?{' '}
          <Link to='/signup' className='text-blue-600 font-semibold hover:underline'>
            Signup
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
