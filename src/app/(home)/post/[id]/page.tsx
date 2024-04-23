'use client';
import PostDetail from '@/component/PostDetail';
import React from 'react';

const PostDetailPage = ({ params }: { params: { id: string } }) => {
  return (
    <div style={{ padding: '150px', background: 'white' }}>
      <PostDetail postId={params.id} />
    </div>
  );
};

export default PostDetailPage;
