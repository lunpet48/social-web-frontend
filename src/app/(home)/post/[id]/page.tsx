'use client';
import PostDetail from '@/component/PostDetail';
import React from 'react';

const PostDetailPage = ({ params }: { params: { id: string } }) => {
  return (
    <div className='bg-white flex flex-col justify-center h-screen px-36'>
      <div className='border-1 rounded-sm'>
        <PostDetail postId={params.id} />
      </div>
    </div>
  );
};

export default PostDetailPage;
