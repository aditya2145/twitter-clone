import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Loader from '../Loader/Loader'

const Connections = () => {
    const navigate = useNavigate();
    const { username, connectionType } = useParams();

    const {
        data: connection,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["connection", username, connectionType],
        queryFn: async () => {
            try {
                const res = await fetch(`/api/users/connections/${username}/${connectionType}`);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong");
                }
                return data;
            } catch (error) {
                throw new Error(error);
            }
        },
    });

    if (error) {
        return <div>Error: {error.message}</div>
    }

    return (
        <div className='w-full xl:w-[45%]'>
            <header className='flex flex-col gap-4 border-b border-b-[#343333]'>
                <div className='flex gap-5'>
                    <button onClick={() => navigate(-1)} className='text-4xl'>&larr;</button>
                    <div className='flex flex-col'>
                        <span className='text-xl font-bold'>{connection?.fullName}</span>
                        <span className='text-md text-[#d5d0d0]'>@{connection?.username}</span>
                    </div>
                </div>

                <div>
                    <button onClick={() => navigate(`/${username}/followers`)} className={`${connectionType == 'followers' ? 'text-[#1A8CD8]' : 'text-white'} w-fit py-3 px-6 font-semibold text-lg hover:bg-[#181818]`}>Followers</button>
                    <button onClick={() => navigate(`/${username}/following`)} className={`${connectionType == 'following' ? 'text-[#1A8CD8]' : 'text-white'} w-fit py-3 px-6 font-semibold text-lg hover:bg-[#181818]`}>Following</button>
                </div>
            </header>

            <main>
                {
                    isLoading && <Loader />
                }
                {!isLoading && connection?.[connectionType].length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <h2 className="text-xl font-semibold text-[#e4e4e4]">
                            {connectionType === 'followers' ? 'No followers yet' : 'Not following anyone yet'}
                        </h2>
                        <p className="text-sm text-[#999] mt-2">
                            {connectionType === 'followers'
                                ? 'When someone follows you, they\'ll show up here.'
                                : 'People you follow will appear here.'}
                        </p>
                    </div>
                )}

                {
                    !isLoading && connection?.[connectionType]?.map(conn => (
                        <div key={conn._id} className='flex gap-3 border p-4 border-[#343333]'>
                            <div className='w-[3rem] h-[3rem] overflow-hidden rounded-full'>
                                <img className='w-full h-full object-cover' src={conn.profileImg} alt="profileImg" />
                            </div>

                            <div className='flex flex-col'>
                                <div onClick={() => navigate(`/profile/${conn.username}`)} className='cursor-pointer hover:underline transition-all duration-200 font-semibold'>{conn.fullName}</div>
                                <div className='text-[#e1dbdb]'>@{conn.username}</div>
                            </div>
                        </div>
                    ))
                }
            </main>
        </div>
    )
}

export default Connections