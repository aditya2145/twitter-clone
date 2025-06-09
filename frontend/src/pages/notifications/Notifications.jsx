import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import userAvatar from '../../assets/userAvatar.png'
import { useNavigate } from 'react-router-dom'
import { getNotifications, deleteNotifications } from '../../api/Services/notificationService'

const Notifications = () => {
  const navigate = useNavigate();

  const {
    data: notifications,
    error,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });

  const queryClient = useQueryClient();

  const {
    mutate: deleteNotificationsMutation,
  } = useMutation({
    mutationKey: ["notifications"],
    mutationFn: deleteNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["notifications"]});
    }
  })


  return (
    <div className='w-[45%] h-screen'>
      <div className='p-4 flex items-center border border-[#2F3336] justify-between'>
        <div className='text-2xl font-bold'>Notifications</div>
        <button onClick={() => deleteNotificationsMutation()} className='bg-white hover:bg-[#e3e2e2] transition-colors duration-300 text-black font-semibold rounded-2xl px-4 py-1'>Delete All</button>
      </div>

      <div className='h-screen border border-[#2F3336]'>
        {notifications?.length === 0 && (
          <div className='text-[#cac6c6] text-xl font-bold p-4'>
            Nothing to see here - yet 🤔
          </div>
        )}

        {notifications?.map(notification => (
          <div className='border border-[#2F3336] p-4 flex items-center gap-3.5' key={notification._id}>
            <div className='w-[3rem] h-[3rem] overflow-hidden rounded-full'>
              <img className='w-full h-full object-cover' src={notification.from.profileImg || userAvatar} alt="avatar" />
            </div>

            <div className='flex items-center gap-1'>
              <span onClick={() => navigate(`/profile/${notification.from.username}`)} className='cursor-pointer font-bold hover:underline transition-all duration-200'>{notification.from.username}</span>
              <span>{notification.type === 'like'? "liked your post" : "followed you"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Notifications