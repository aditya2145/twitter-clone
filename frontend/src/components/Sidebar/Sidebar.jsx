import React, { useEffect, useState } from 'react'
import './Sidebar.css'
import { useNavigate } from 'react-router-dom'
import HomeLogo from '../../assets/home.svg'
import NotificationLogo from '../../assets/notifications.svg'
import ProfileLogo from '../../assets/person.svg'
import LogoutLogo from '../../assets/logout.svg'
import MessageLogo from '../../assets/message.svg'
import { useAuth } from '../../context/AuthContext/AuthProvider';
import LogoutModal from '../LogoutModal/LogoutModal'

const Sidebar = ({ openSidebar, setOpenSidebar }) => {
    const navigate = useNavigate();
    const { authUser, logout } = useAuth();
    const [confirmLogout, setConfirmLogout] = useState(false);
    const [count, setCount] = useState(0);


    return (
        <div className={`${!openSidebar? 'hidden' : 'flex'} sticky top-0 xl:flex xl:w-[25%] left-0 borderRight p-4 h-screen flex-col justify-between`}>
            {openSidebar && <div onClick={() => setOpenSidebar(false)} className='fixed inset-0 z-10 bg-black opacity-50 xl:hidden'></div>}

            <div className={`${openSidebar? 'flex' : 'hidden'} bg-black fixed z-20 h-screen top-0 left-0 flex flex-col justify-between xl:flex xl:static`}>
                <div className='flex flex-col gap-4'>
                    <button onClick={() => {
                        navigate('/'); 
                        setOpenSidebar(false)
                        }
                    } className='sidebar-btn flex gap-3 items-center text-xl'>
                        <span>
                            <img className='sidebarLogo w-[2rem]' src={HomeLogo} alt="home_logo" />
                        </span>
                        <span>Home</span>
                    </button>

                    <button 
                    onClick={() => {
                            navigate('/notifications');
                            setOpenSidebar(false);
                        }
                    } className='sidebar-btn flex gap-3 items-center text-xl'>
                        <span className='relative'>
                            <img className='sidebarLogo w-[2rem]' src={NotificationLogo} alt="notification_logo" />
                            <span className={`absolute h-3 w-3 rounded-full ${count ? 'bg-red-500' : ''} top-0 left-4`}></span>
                        </span>
                        <span>Notifications</span>
                    </button>

                    <button onClick={() => {
                        navigate('/messages');
                        setOpenSidebar(false);
                    }} className='sidebar-btn flex gap-3 items-center text-xl'>
                        <span>
                            <img className='sidebarLogo w-[2rem]' src={MessageLogo} alt="message_logo" />
                        </span>
                        <span>Messages</span>
                    </button>

                    <button onClick={() => {
                        navigate(`/profile/${authUser.username}`);
                        setOpenSidebar(false);
                    }} className='sidebar-btn flex gap-3 items-center text-xl'>
                        <span>
                            <img className='homeLogo w-[2rem]' src={ProfileLogo} alt="person_logo" />
                        </span>
                        <span>Profile</span>
                    </button>
                </div>

                <div>
                    <button onClick={() => setConfirmLogout(true)} className='sidebar-btn flex gap-3 items-center text-xl'>
                        <span className='w-[2.5rem] h-[2.5rem] rounded-full overflow-hidden'>
                            <img className='object-cover w-full h-full' src={authUser.profileImg} alt="profileImg" />
                        </span>
                        <span>{authUser?.username}</span>
                        <span>
                            <img className='w-[1rem]' src={LogoutLogo} alt="logout_logo" />
                        </span>
                    </button>

                    {confirmLogout && <LogoutModal handleLogout={logout} setConfirmLogout={setConfirmLogout} />}

                </div>
            </div>
        </div>
    )
}

export default Sidebar