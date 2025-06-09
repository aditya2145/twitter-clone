import React from 'react'

const OpenPicture = ({ profilePic, SetOpenPicture }) => {
    return (
        <div>
            <div
                className="fixed inset-0 bg-[black] opacity-90 z-40"
                onClick={() => SetOpenPicture(false)}
            ></div>

            <button className='fixed z-40 right-15 top-5 text-4xl' onClick={() => SetOpenPicture(false)}>&times;</button>

            {/* Modal */}
            <div className="fixed w-[30rem] h-[30rem] overflow-hidden z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                                    bg-black text-white rounded-full">
                <img className='h-full w-full object-cover' src={profilePic} alt="image" />
            </div>
        </div>
    )
}

export default OpenPicture