import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Conversation.css';
import Socket from '../../socket/Socket';
import { useAuth } from '../../context/AuthContext/AuthProvider'
import { getUserProfile } from '../../api/Services/userService';
import { getConversation, sendMessage } from '../../api/Services/messageService';

const Conversation = () => {
    const [text, setText] = useState('');
    const { username } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const messagesContainerRef = useRef(null);

    const { authUser } = useAuth();

    const {
        data: user,
        isLoading,
      } = useQuery({
        queryKey: ["userProfile", username],
        queryFn: () => getUserProfile({username}),
      });

    const { data: conversation } = useQuery({
        queryKey: ["conversation", username],
        queryFn: () => getConversation({username}),
    });

    const {
        mutate: sendMessageMutation,
        isPending: isSending,
        error,
    } = useMutation({
        mutationFn: () => sendMessage({user, text}),
        onSuccess: () => {
            setText('');
            queryClient.invalidateQueries({ queryKey: ["conversation", username] });
        },
    });

    const handleSendMessage = () => {
        if (!text.trim()) return;
        sendMessageMutation();
    };

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [conversation?.messages]);

    useEffect(() => {
        if (authUser?._id) {
            Socket.emit("join", authUser._id);
        }

        Socket.on("newMessage", (newMessage) => {
            const isSenderOrReceiver =
                newMessage?.sender?._id === user?._id || newMessage?.receiver?._id === user?._id;

            if (isSenderOrReceiver) {
                queryClient.invalidateQueries({ queryKey: ["conversation", username] });
            }
        });

        return () => {
            Socket.off("newMessage");
        };
    }, [authUser?._id, user?._id, username, queryClient]);

    return (
        <div className='w-full xl:w-[45%] h-screen flex flex-col'>
            <div className='px-4 py-2 bg-[#252424] flex justify-between items-center'>
                <div className='flex items-center gap-3'>
                    <div className='w-[3.2rem] h-[3.2rem] rounded-full overflow-hidden'>
                        <img className='w-full h-full object-cover' src={user?.profileImg} alt="profileImg" />
                    </div>
                    <div className='text-xl font-semibold'>{user?.username}</div>
                </div>
                <button
                    className='bg-[#edeaea] hover:bg-[#c3c1c1] transition-colors duration-300 px-5 py-1 rounded-3xl text-black font-semibold'
                    onClick={() => navigate(-1)}
                >
                    Back
                </button>
            </div>

            <div className='scrollbar-custom flex-1 overflow-y-auto scrollbar-hide' ref={messagesContainerRef}>
                {
                    conversation?.messages.map((convo) => (
                        <div
                            key={convo._id}
                            className={`p-4 text-md flex ${authUser?._id === convo.sender._id ? 'justify-end' : 'justify-start'} items-start gap-1.5`}
                        >
                            <div className='w-[2.5rem] h-[2.5rem] overflow-hidden rounded-full'>
                                <img className='w-full h-full object-cover' src={convo.sender.profileImg} alt="profileImg" />
                            </div>
                            <div className='bg-[#232323] p-3 rounded-lg'>
                                {convo.text}
                            </div>
                        </div>
                    ))
                }
            </div>

            <div className='bg-[#272525] p-4 w-full flex items-center justify-between'>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder='Send Message'
                    className='p-2 flex outline-0 resize-none w-[80%] border rounded-lg rounded-tl-[0] border-[#6b6767]'
                ></textarea>
                <button
                    onClick={handleSendMessage}
                    className='bg-[#f3f0f0] hover:bg-[#c3c1c1] transition-colors duration-300 px-5 py-1 rounded-3xl text-black font-semibold'
                >
                    {isSending ? 'Sending' : 'Send'}
                </button>
            </div>
        </div>
    );
};

export default Conversation;
