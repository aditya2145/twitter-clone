import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext/AuthProvider';
import { createPost } from '../../api/Services/postService';

const CreatePost = () => {
  const { authUser } = useAuth();
  const [text, setText] = useState('');
  const [img, setImg] = useState(null);
  const queryClient = useQueryClient();

  const {
    mutate: createPostMutation,
    isPending: isPosting,
    error: errorPosting,
  } = useMutation({
    mutationFn: () => createPost({ text, img }),
    onSuccess: () => {
      setText('');
      setImg(null);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const handleImgChange = (e) => {
    setImg(e.target.files[0]);
  };

  const handlePost = (e) => {
    e.preventDefault();
    if (!text.trim() && !img) return;
    createPostMutation();
  };

  return (
    <div className="w-full bg-black text-white border border-neutral-800 rounded-lg p-5 shadow-sm">
      {/* Profile and Input */}
      <div className="flex gap-4 mb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <img
            src={authUser?.profileImg}
            alt="avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's happening?"
          rows={3}
          className="w-full resize-none bg-[#0e0e0e] border border-neutral-700 rounded-md px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none"
        />
      </div>

      {/* Upload & Post */}
      <div className="flex justify-between items-center">
        <label
          htmlFor="imageUpload"
          className="inline-flex items-center gap-2 cursor-pointer text-blue-400 hover:text-blue-500 text-sm font-medium transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4-4a3 3 0 014.243 0l4 4M4 12v6a2 2 0 002 2h12a2 2 0 002-2v-6M12 4v4m0 0l2-2m-2 2L10 6"
            />
          </svg>
          Upload Image
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleImgChange}
            className="hidden"
          />
        </label>

        <button
          onClick={handlePost}
          disabled={isPosting}
          className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-full text-sm font-semibold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPosting ? 'Posting...' : 'Post'}
        </button>
      </div>

      {/* Error */}
      {errorPosting && (
        <p className="text-red-500 text-sm mt-2">{errorPosting.message}</p>
      )}
    </div>
  );
};

export default CreatePost;
