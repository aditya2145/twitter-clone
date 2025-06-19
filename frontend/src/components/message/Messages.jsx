import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getAllConversations } from '../../api/Services/messageService';


const Messages = () => {
    const navigate = useNavigate();

    const {
        data: messages,
    } = useQuery({
        queryKey: ["messages"], 
        queryFn: getAllConversations,
    })

  return (
    <div className='w-full xl:w-[45%]'>
        <div className='p-4 font-bold text-2xl text-[#f0ebeb]'>Messages</div>

        <div>
            {messages?.length === 0 && (
                <div className='p-4 text-[#dbd8d8] vfont-semibold text-lg'>
                    You have no conversations yet 🤔
                </div>
            )}

            {messages && (
                <div>
                    {
                        messages.map(message => (
                            <div onClick={() => navigate(`/messages/${message.user.username}`)} role='button' className='cursor-pointer hover:bg-[#202020] transition-colors duration-300 w-full border p-2 border-[#353434] flex items-center gap-3'>
                                <div className='w-[3.5rem] h-[3.5rem] rounded-full overflow-hidden'>
                                    <img className='w-full h-full object-cover' src={message.user.profileImg} alt="profileImg" />
                                </div>

                                <div className='flex flex-col'>
                                    <div className='text-lg font-semibold'>@{message.user.username}</div>
                                    <div className='text-[#ddd9d9]'>{message.lastMessage.sender.username}: {message.lastMessage.text.slice(0,5)+"..."}</div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            )}
        </div>
    </div>
  )
}

export default Messages