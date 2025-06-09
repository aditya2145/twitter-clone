import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Comment from '../../assets/comment.svg'
import Delete from '../../assets/delete.svg'
import Edit from '../../assets/edit.svg'
import More from '../../assets/more.svg'
import CommentModal from '../../pages/comment/CommentModal';
import { useAuth } from '../../context/AuthContext/AuthProvider';
import { commentOnPost, deletePost, likeUnlikePost } from '../../api/Services/postService';

const Post = ({ post }) => {
    const [moreModal, setMoreModal] = useState(false);
    const [commentModal, setCommentModal] = useState(false);
    const [comment, setComment] = useState();
    const { authUser } = useAuth();
    const queryClient = useQueryClient();
    const postOwner = post.user;
    const isLiked = post.likes.includes(authUser._id);

    const isMyPost = authUser._id === post.user._id;


    const {
        mutate: likePost,
        isPending: isLiking,
        isRefetching,
    } = useMutation({
        mutationKey: ["posts"],
        mutationFn: () => likeUnlikePost({ post }),
        onSuccess: () => {
            queryClient.setQueryData(["posts"], (oldData) => {
                if (!oldData) return [];

                return oldData.map((p) => {
                    if (p._id === post._id) {
                        const hasLiked = p.likes.includes(authUser._id);
                        const updatedLikes = hasLiked
                            ? p.likes.filter((id) => id !== authUser._id)
                            : [...p.likes, authUser._id];

                        return { ...p, likes: updatedLikes };
                    }
                    return p;
                });
            });
        },
    });

    const {
        mutate: commentPost,
        isPending: isCommenting,
    } = useMutation({
        mutationKey: ["posts"],
        mutationFn: () => commentOnPost({ post, comment }),
        onSuccess: () => {
            setComment("");
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
    });

    const {
        mutate: deletePostMutation,
        isPending: isDeleting,
    } = useMutation({
        mutationKey: ["posts"],
        mutationFn: () => deletePost({ post }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
    })

    const handleLikePost = () => {
        if (isLiking) return;
        likePost();
    }

    const handlePostComment = (e) => {
        if (!comment.trim()) {
            alert('Comment cannot be empty');
            return;
        }
        e.preventDefault();
        if (isCommenting) return;
        commentPost();
    }

    const handleDeletePost = () => {
        if (!isMyPost) {
            alert('You cannot delete this');
            return;
        }
        deletePostMutation();
    }

    return (
        <div className='flex gap-2 z-10 p-4 border border-[#2F3336]'>
            <div className='avatar'>
                <Link to={`/profile/${postOwner.username}`}>
                    <div className='rounded-full w-[2.8rem] h-[2.8rem] overflow-hidden'>
                        <img className='w-full h-full object-cover' src={postOwner.profileImg} alt="avatar" />
                    </div>
                </Link>
            </div>

            <div className='flex flex-col'>
                <div className='flex gap-2'>
                    <Link className='font-bold transition-all duration-300 hover:underline' to={`/profile/${postOwner.username}`}>
                        {postOwner.fullName}
                    </Link>

                    <div className='text-[#9f9a9a]'>
                        @{postOwner.username}
                    </div>

                    {isMyPost &&
                        <button onClick={() => setMoreModal(!moreModal)} className='w-[1.5rem] h-[1.5rem] overflow-hidden'>
                            <img className='h-full w-full object-cover' src={More} alt="more_icon" />
                        </button>
                    }

                    {moreModal && (
                        <>
                            {/* Backdrop */}
                            <div
                                onClick={() => setMoreModal(false)}
                                className="fixed inset-0 bg-black/50 z-20"
                            ></div>

                            {/* Modal */}
                            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 bg-zinc-900 flex flex-col border border-zinc-700 rounded-xl w-[90%] max-w-sm overflow-hidden shadow-lg">

                                {/* Delete Button */}
                                <button
                                    onClick={handleDeletePost}
                                    className="flex items-center gap-3 p-4 border-b border-zinc-700 hover:bg-zinc-800 transition-colors duration-300"
                                >
                                    <div className="w-6 h-6">
                                        <img className="w-full h-full object-cover" src={Delete} alt="delete_logo" />
                                    </div>
                                    <span className="text-white">Delete Post</span>
                                </button>

                                {/* Edit Button */}
                                <button
                                    className="flex items-center gap-3 p-4 hover:bg-zinc-800 transition-colors duration-300"
                                >
                                    <div className="w-6 h-6">
                                        <img className="w-full h-full object-cover" src={Edit} alt="edit_logo" />
                                    </div>
                                    <span className="text-white">Edit Post</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>

                <div className='postContent flex flex-col gap-2'>
                    <div>
                        {post.text}
                    </div>

                    {post.img && (
                        <div className='w-[90%] rounded-md overflow-hidden'>
                            <img className='w-full h-full object-cover' src={post.img} alt="postImg" />
                        </div>
                    )}
                </div>

                <div className='mt-4 flex gap-4 items-center'>
                    <div className='flex items-center gap-1'>
                        <button onClick={handleLikePost} className='w-[1.5rem] h-[1.5rem] overflow-hidden'>
                            <svg className={isLiked ? 'fill-[#198CD8]' : 'fill-[white]'}
                                fill="currentColor"
                                strokeWidth="0"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 1024 1024"
                                height="100%"
                                width="100%"
                                style={{ overflow: 'visible', color: 'currentColor' }}><path d="M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7 0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 0 0-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4A106.62 106.62 0 0 0 471 99.9c-52 0-98 35-111.8 85.1l-85.9 311H144c-17.7 0-32 14.3-32 32v364c0 17.7 14.3 32 32 32h601.3c9.2 0 18.2-1.8 26.5-5.4 47.6-20.3 78.3-66.8 78.3-118.4 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7-.2-12.6-2-25.1-5.6-37.1zM184 852V568h81v284h-81zm636.4-353-21.9 19 13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 22.4-13.2 42.6-33.6 51.8H329V564.8l99.5-360.5a44.1 44.1 0 0 1 42.2-32.3c7.6 0 15.1 2.2 21.1 6.7 9.9 7.4 15.2 18.6 14.6 30.5l-9.6 198.4h314.4C829 418.5 840 436.9 840 456c0 16.5-7.2 32.1-19.6 43z"></path></svg>
                        </button>
                        <button>{post.likes.length}</button>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <button onClick={() => setCommentModal(true)} className='w-[1.5rem] h-[1.5rem] overflow-hidden'>
                            <img className='h-full w-full object-cover' src={Comment} alt="comment_logo" />
                        </button>
                        <button>{post.comments.length}</button>
                    </div>
                    <CommentModal comments={post.comments} setComment={setComment} comment={comment} handlePostComment={handlePostComment} postOwner={post.user.username} setCommentModal={setCommentModal} isOpen={commentModal} />
                </div>
            </div>
        </div>
    )
}

export default Post