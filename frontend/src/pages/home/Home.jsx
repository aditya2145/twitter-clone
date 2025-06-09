import React, { useState } from 'react'
import CreatePost from './CreatePost'
import Posts from '../../components/posts/Posts';

const Home = () => {
  const [feedType, setFeedType] = useState('foryou');

  return (
    <div className='w-[45%] border-r-1 border-r-[#565656] flex flex-col'>
      <header className='text-[1.1rem] w-full border-1 border-[#565656] flex items-center justify-between'>
        <div role='button' onClick={() => setFeedType('foryou')} className={`cursor-pointer h-full w-[50%] p-3 hover:bg-[#181818] transition-colors duration-300 content-center text-center ${feedType === 'foryou'? 'text-[#1A8CD8] font-bold' : 'text-white'}`}>For you</div>
        <div role='button' onClick={() => setFeedType('following')} className={`cursor-pointer h-full w-[50%] p-3 hover:bg-[#181818] transition-colors duration-300 content-center text-center ${feedType === 'following'? 'text-[#1A8CD8] font-bold' : 'text-white'}`}>Following</div>
      </header>

      <CreatePost />

      <Posts feedType={feedType} />
    </div>
  )
}

export default Home