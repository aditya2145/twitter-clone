import React, { useState } from 'react'
import SearchIcon from '../../assets/searchIcon.svg'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { followUnfollowUser, getSuggestedUsers } from '../../api/Services/userService'
 
const RightPanel = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [_username, setUser] = useState('');
  
  const {
    mutate: followUnfollowMutation,
  } = useMutation({
    mutationFn: (username) => followUnfollowUser({username}),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["authUser"]});
      queryClient.invalidateQueries({queryKey: ["suggestedUsers"]});
    }
  })

  const {
    data: suggestedUsers,
  } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: getSuggestedUsers,
  })

  return (
    <div className='top-0 right-0 overflow-y-auto border-l border-l-[#2F3336] w-[30%] py-0.5 px-4 flex flex-col gap-6 '>
      <div className='border-1 rounded-3xl px-4 border-[#656363] flex items-center w-fit'>
        <span className='w-[1.3rem] h-[1.3rem] overflow-hidden'>
          <img className='h-full w-full object-cover' src={SearchIcon} alt="search_logo" />
        </span>
        <input value={_username} onChange={(e) => setUser(e.target.value)} style={
          {
            border: 'none',
            outline: 'none',
            boxShadow: 'none',
          }} type="text" placeholder='Search' />
      </div>

      <div className='flex flex-col gap-4'>
        <h2 className='text-xl font-bold'>Suggested Users</h2>
        <div className='flex flex-col'>
          {
            suggestedUsers?.map(user => (
              <div key={user._id} className='border border-[#3b3a3a] p-4 flex justify-between items-start'>
                <div className='flex gap-3 '>
                  <div className='w-[3rem] h-[3rem] overflow-hidden rounded-full'>
                    <img className='w-full h-full object-cover' src={user.profileImg} alt="profileImg" />
                  </div>

                  <div className='flex flex-col'>
                    <div onClick={() => navigate(`/profile/${user.username}`)} className='cursor-pointer hover:underline transition-all duration-200 font-semibold'>{user.fullName}</div>
                    <div className='text-[#e1dbdb]'>{user.username}</div>
                  </div>
                </div>

                <button onClick={() => followUnfollowMutation(user?.username)} className='hover:bg-[#dbd8d8] transition-colors duration-300 rounded-2xl bg-[white] text-black font-semibold px-4 py-1'>
                  Follow
                </button>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default RightPanel