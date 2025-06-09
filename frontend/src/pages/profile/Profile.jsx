import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import userAvatar from '../../assets/userAvatar.png'
import MessageLogo from '../../assets/mail.svg'
import Posts from '../../components/posts/Posts';
import EditProfileModal from './EditProfileModal';
import OpenPicture from '../../components/OpenPicture/OpenPicture';
import { useAuth } from '../../context/AuthContext/AuthProvider';
import { followUnfollowUser, getUserProfile } from '../../api/Services/userService';
import Loader from '../../components/Loader/Loader';

const Profile = () => {
  const { authUser } = useAuth();
  const navigate = useNavigate();
  const [openPicture, SetOpenPicture] = useState({open:false, pic:null});
  const [feedType, setFeedType] = useState('posts');
  const [profileModal, setProfileModal] = useState(false);

  const { username } = useParams();

  const queryClient = useQueryClient();

  const {
    mutate: followUnfollowMutation,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: () => followUnfollowUser({username}),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["authUser"]});
      queryClient.invalidateQueries({queryKey: ["suggestedUsers"]});
    },
  })

  const handleFollowUnfollow = () => {
    followUnfollowMutation();
  };

  const {
    data: user,
    isLoading,
    isRefetching,
    error: errorGettingUser,
  } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: () => getUserProfile({username}),
  });

  const isMyProfile = authUser?._id === user?._id;
  const amIFollowing = authUser?.following.includes(user?._id);

  return (
    <div className='w-[45%] h-screen '>
      { (isLoading || isRefetching) && (
        <Loader />
      )}

      { !isLoading && !isRefetching && !user && (
        <p>User Not found</p>
      )}

      { !isLoading && !isRefetching && user && (
      <div className='profileHeader flex flex-col'>
        <div className='text-xl flex items-center gap-2 p-2'>
          <button onClick={() => navigate(-1)} className='text-3xl'>&larr;</button>
          <span>{user?.fullName}</span>
        </div>

        <div className='flex flex-col border border-[#2F3336]'>
          <div onClick={() => SetOpenPicture({open:true, pic:user.coverImg})} className='cursor-pointer coverImg w-full h-[11rem] bg-[#333639] overflow-hidden'>
            {user?.coverImg && (
              <img className='w-full h-full object-cover' src={user?.coverImg || userAvatar} alt="coverImg" />
            )}
          </div>

          <div onClick={() => SetOpenPicture({open:true, pic:user.profileImg})} className='cursor-pointer profileImg h-[8rem] w-[8rem] my-[-2.9rem] mx-2 overflow-hidden rounded-full left-[2rem] top-[10rem]'>
            <img className='w-full h-full object-cover' src={user?.profileImg || userAvatar} alt="profileImg" />
          </div>

          {isMyProfile && (
            <div>
              <div className='mr-3 flex justify-end'>
                <button onClick={() => setProfileModal(true)} className='hover:bg-[#2d2d2d] transition-colors duration-300 font-bold border p-1 px-4 rounded-3xl'>Edit Profile</button>
              </div>
              <EditProfileModal user={authUser} profileModal={profileModal} setProfileModal={setProfileModal} />
            </div>
          )}

          {!isMyProfile && (
            <div className='p-3 flex gap-2 self-end'>
              <button onClick={() => navigate(`/messages/${user?.username}`)} className='font-bold border hover:bg-[#242424] transition-colors duration-300 border-[#1A8CD8] px-3 rounded-full'>
                <img src={MessageLogo} alt="message_logo" />
              </button>
              <button onClick={handleFollowUnfollow} className={`font-bold text-black transition-colors duration-300 p-1 px-4 rounded-3xl ${amIFollowing? 'bg-[#116196] text-white border-0' : 'bg-[white] hover:bg-[#d5d2d2] border-0'}`}>{amIFollowing? 'Following' : 'Follow'}</button>
            </div>
          )}

          <div className='flex flex-col gap-1'>
            <div className='p-6 flex flex-col gap-1'>
              <div className='text-xl font-bold'>
                {user?.fullName}
              </div>

              <div className='text-[#9d9999]'>
                @{user?.username}
              </div>

              <div className='text-[#9d9999]'>
                {new Date(user?.createdAt).toLocaleDateString()}
              </div>

              <div className='flex gap-4'>
                <div onClick={() => navigate(`/${user.username}/following`)} className='cursor-pointer hover:underline transition-all duration-200'><span className='font-bold text-lg'>{user?.following.length}</span> <span className='text-[#9d9999] font-semibold'>Following</span></div>
                <div onClick={() => navigate(`/${user.username}/followers`)} className='cursor-pointer hover:underline transition-all duration-200'><span className='font-bold text-lg'>{user?.followers.length}</span> <span className='text-[#9d9999] font-semibold'>Followers</span></div>
              </div>
            </div>

            <div className='flex'>
              <button onClick={() => setFeedType('posts')} className={`${feedType == 'posts'? 'text-[#1A8CD8]' : 'text-white'} w-fit py-3 px-6 font-semibold text-lg hover:bg-[#181818]`}>Posts</button>
              <button onClick={() => setFeedType('likes')} className={`${feedType == 'likes'? 'text-[#1A8CD8]' : 'text-white'} w-fit py-3 px-6 font-semibold text-lg hover:bg-[#181818]`}>Likes</button>
            </div>
          </div>

        </div>
        <Posts feedType={feedType} username={username} />
      </div>
      )}

      {openPicture.open && user && <OpenPicture profilePic={openPicture.pic} SetOpenPicture={SetOpenPicture} />}
    </div>
  )
}

export default Profile