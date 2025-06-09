import React from 'react'
import defaultImg from '../../assets/userAvatar.png'
import { useNavigate } from 'react-router-dom';

const CommentModal = ({ comments, isOpen, handlePostComment, setComment, setCommentModal, postOwner }) => {
    const navigate = useNavigate();
    if (!isOpen) return null;

    return (

        <div>
            {/* Background Overlay */}
            <div
                className="fixed inset-0 bg-[black] opacity-60 z-40"
                onClick={() => setCommentModal(false)}
            ></div>

            {/* Modal */}
            <div className="overflow-auto max-h-[90vh] fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                            bg-black text-white w-[600px] max-w-[100%] rounded-xl p-6 shadow-lg">
                {/* Close Button */}
                <div className="flex justify-end">
                    <button onClick={() => setCommentModal(false)} className="text-white text-2xl">&times;</button>
                </div>

                {/* Reply Area */}
                <div className="mt-2">
                    <p className="text-sm text-gray-400 mb-2">
                        Replying to <span className="text-blue-500">{postOwner}</span>
                    </p>
                    <textarea
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full bg-transparent border border-gray-700 rounded-md text-white p-2 mt-1 resize-none focus:outline-none"
                        rows="4"
                        placeholder="Post your reply"
                    ></textarea>

                    {/* Action Bar */}
                    <div className="mt-4 flex justify-between items-center">
                        <div className="text-blue-500 flex gap-3">
                            <i className="fas fa-image cursor-pointer"></i>
                            <i className="fas fa-chart-bar cursor-pointer"></i>
                            <i className="fas fa-smile cursor-pointer"></i>
                        </div>
                        <button onClick={handlePostComment} className="bg-white text-black px-4 py-1 rounded-full font-semibold">Reply</button>
                    </div>
                </div>

                <div className='flex flex-col gap-4'>
                    <h2 className='text-center text-xl font-bold'>Comments</h2>

                    { comments.length === 0 && 
                        <div className='text-center text-lg text-[#c2bcbc]'>
                            No Comments, Be the first to comment.
                        </div>
                    }

                    <div>
                        {comments.map(comment => (
                            <div className='p-4 border border-[#2F3336] flex gap-2'>
                                <div className='h-[2.5rem] w-[2.5rem] overflow-hidden rounded-full'>
                                    <img className='w-full h-full object-cover' src={comment.user.profileImg || defaultImg} alt="profileImg" />
                                </div>
                                <div className='flex flex-col'>
                                    <div className='flex items-center gap-2'>
                                        <div onClick={() => navigate(`/profile/${comment.user.username}`)} className='cursor-pointer text-lg font-bold hover:underline transition-all duration-200'>{comment.user.fullName}</div>
                                        <div className='text-[#bdb9b9]'>@{comment.user.username}</div>
                                    </div>
                                    <div>{comment.text}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentModal;
