import React, { useState } from 'react'
import SelectImage from '../../assets/imageSelect.svg'
import userAvatar from '../../assets/userAvatar.png'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser } from '../../api/Services/userService'

const EditProfileModal = ({ user, profileModal, setProfileModal }) => {
    const [profileImg, setProfileImg] = useState(null);
    const [coverImg, setCoverImg] = useState(null);
    const [fullName, setFullName] = useState('');
    const [bio, setBio] = useState('');
    const [currentPassword, setCurrPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');


    const queryClient = useQueryClient();
    const {
        mutate: updateUserMutation,
        isPending,
        error: errorUpdating,
    } = useMutation({
        mutationKey: ["authUser"],
        mutationFn: () => updateUser({profileImg, coverImg, fullName, bio, currentPassword, newPassword}),
        onSuccess: () => {
            setProfileImg(null);
            setCoverImg(null);
            setBio('');
            setFullName('');
            setCurrPassword('');
            setNewPassword('');
            setProfileModal(false);
            queryClient.invalidateQueries({queryKey: ["authUser"]});
        },
    })

    const handleImgChange = (e) => {
        if(e.target.name === 'profileImg') {
            setProfileImg(e.target.files[0]);
        }
        else {
            setCoverImg(e.target.files[0]);
        }
    };

    const handleSave = () => {
        updateUserMutation();
    }

    if (!profileModal) {
        return null;
    }

    return (
        <div>
            {/* Background Overlay */}
            <div onClick={() => setProfileModal(false)} className='fixed inset-0 bg-[#242D34] opacity-70 z-60'></div>

            {/* Modal */}
            <div className='overflow-auto w-[80vw] xl:w-[40vw] max-h-[80vh] fixed p-4 flex flex-col gap-6 z-70 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black rounded-md'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2 text-xl font-bold'>
                        <button onClick={() => setProfileModal(false)}>&times;</button>
                        <div>Edit Profile</div>
                        {errorUpdating && <div className='text-red-500'>{errorUpdating.message}</div>}
                    </div>

                    <button onClick={handleSave} disabled={isPending} className={`hover:bg-[#dcdada] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 bg-white font-semibold text-black px-4 py-1 rounded-2xl`}>{isPending? "Saving..." : "Save"}</button>
                </div>

                {/* Images */}
                <div className='flex flex-col gap-3'>
                    <div className='relative coverImg w-full h-[11rem] bg-[#333639] overflow-hidden'>
                        {user?.coverImg && (
                            <img className='w-full h-full object-cover' src={user?.coverImg} alt="coverImg" />
                        )}
                        <label className='p-2 hover:bg-[black] transition-colors duration-300 absolute top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2 cursor-pointer h-[2.5rem] w-[2.5rem] overflow-hidden rounded-full' htmlFor='coverImg'>
                            <img className='w-full h-full object-cover' src={SelectImage} alt="image_logo" />
                            <input onChange={handleImgChange} name='coverImg' id='coverImg' className='hidden' type="file" />
                        </label>
                    </div>

                    <div className='profileImg h-[8rem] w-[8rem] overflow-hidden rounded-full absolute left-[2rem] top-[10rem] z-50'>
                        <img className='w-full h-full object-cover' src={user?.profileImg || userAvatar} alt="profileImg" />
                        <label className='p-2 hover:bg-[black] transition-colors duration-300 absolute top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2 cursor-pointer h-[2.5rem] w-[2.5rem] overflow-hidden rounded-full' htmlFor='profileImg'>
                            <img className='w-full h-full object-cover' src={SelectImage} alt="image_logo" />
                            <input onChange={handleImgChange} name='profileImg' id='profileImg' className='hidden' type="file" />
                        </label>
                    </div>
                </div>

                <div className='mt-6 flex flex-col gap-4'>
                    <div className='flex flex-col border border-[#333639] rounded-md'>
                        <span className='ml-3 mt-3 text-[#c7c4c4]'>Full Name</span>
                        <input onChange={(e) => setFullName(e.target.value)} type="text" style={{ border: 'none', outline: 'none' }} />
                    </div>
                    <div className='flex flex-col border border-[#333639] rounded-md'>
                        <span className='ml-3 mt-3 text-[#c7c4c4]'>Bio</span>
                        <input onChange={(e) => setBio(e.target.value)} type="text" style={{ border: 'none', outline: 'none' }} />
                    </div>
                    <div className='flex flex-col border border-[#333639] rounded-md'>
                        <span className='ml-3 mt-3 text-[#c7c4c4]'>Current Password</span>
                        <input onChange={(e) => setCurrPassword(e.target.value)} type="password" style={{ border: 'none', outline: 'none' }} />
                    </div>
                    <div className='flex flex-col border border-[#333639] rounded-md'>
                        <span className='ml-3 mt-3 text-[#c7c4c4]'>New Password</span>
                        <input onChange={(e) => setNewPassword(e.target.value)} type="password" style={{ border: 'none', outline: 'none' }} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditProfileModal