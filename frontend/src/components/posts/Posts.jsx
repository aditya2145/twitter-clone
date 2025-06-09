import React from 'react'
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import PostSkeleton from '../skeleton/postSkeleton/PostSkeleton';
import Post from '../post/Post';
import { getPosts } from '../../api/Services/postService';

const Posts = ({ feedType, username }) => {

    const getEndPoint = () => {
        switch (feedType) {
            case 'foryou':
                return '/api/post/all';
            case 'following':
                return '/api/post/following';
            case 'posts':
                return `/api/post/user/${username}`;
            case 'likes':
                return `/api/post/likedPosts/${username}`;
            default:
                return '/api/post/all';
        }
    };

    const POST_ENDPOINT = getEndPoint();

    const {
        data: posts,
        isLoading: loadingPosts,
        refetch,
        isRefetching: refetchingPosts,
    } = useQuery({
        queryKey: ["posts"],
        queryFn: () => getPosts(POST_ENDPOINT),
    });

    useEffect(() => {
        refetch();
    }, [feedType, refetch, username])


    return (
        <div className='flex flex-col justify-center'>
            {(loadingPosts || refetchingPosts) && (
                <div>
                    <PostSkeleton />
                    <PostSkeleton />
                    <PostSkeleton />
                </div>
            )}

            {!loadingPosts && !refetchingPosts && posts?.length === 0 && (
                <p className='text-center my-4'>No posts in this tab. Switch 👻</p>
            )}

            {!loadingPosts && !refetchingPosts && posts && (
                <div>
                    {
                        posts.map(post => (
                            <Post key={post._id} post={post} />
                        ))
                    }
                </div>
            )}
        </div>
    )
}

export default Posts