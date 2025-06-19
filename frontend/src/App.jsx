import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import SignupPage from './pages/auth/signup/SignupPage'
import LoginPage from './pages/auth/login/LoginPage'
import Sidebar from './components/Sidebar/Sidebar'
import Home from './pages/home/Home'
import RightPanel from './components/RightPanel/RightPanel'
import Notifications from './pages/notifications/Notifications'
import Profile from './pages/profile/Profile'
import Messages from './components/message/Messages'
import Conversation from './components/conversation/Conversation'
import Connections from './components/followList/Connections'
import { useAuth } from './context/AuthContext/AuthProvider'
import Loader from './components/Loader/Loader'
import { useState } from 'react'

function App() {
  const { authUser, isLoading } = useAuth();
  const [openSidebar, setOpenSidebar] = useState(false);

  if (isLoading) {
    return (
      <div className='h-screen flex justify-center items-center'>
        <Loader />
      </div>
    );
  }

  return (
    <div className='flex flex-col overflow-x-hidden border-collapse xl:flex xl:flex-row w-screen h-screen bg-black text-white'>
      {authUser && (
        <Sidebar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
      )}

      {authUser && (
        <div className='w-screen flex items-center pb-4 pl-4 xl:hidden'>
          <button onClick={() => setOpenSidebar(!openSidebar)} className="text-white text-2xl" aria-label="Menu">
            ☰
          </button>
        </div>
      )}


      <Routes>
        <Route path='/' element={authUser ? <Home /> : <Navigate to='/login' />} />
        <Route path='/signup' element={!authUser ? <SignupPage /> : <Navigate to='/' />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
        <Route path='/notifications' element={authUser ? <Notifications /> : <Navigate to='/login' />} />
        <Route path='/profile/:username' element={authUser ? <Profile /> : <Navigate to='/login' />} />
        <Route path='/messages' element={authUser ? <Messages /> : <Navigate to='/login' />} />
        <Route path='/messages/:username' element={authUser ? <Conversation /> : <Navigate to='/login' />} />
        <Route path='/:username/:connectionType' element={authUser ? <Connections /> : <Navigate to='/login' />} />
      </Routes>

      {authUser && (
        <RightPanel />
      )}
    </div>
  )
}

export default App
