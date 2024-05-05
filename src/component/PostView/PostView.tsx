import { useEffect, useState } from 'react';
import '../index.css';
import Loading from '@/component/Loading';
import { post } from '@/type/type';
import { getPosts } from '@/services/postService';
import Post from '../Post/Post';

const PostView = () => {
  const [posts, setPosts] = useState<post[]>([]);
  const [loadingPage, setLoadingPage] = useState(true);

  const fetchPosts = async () => {
    const posts: post[] = await getPosts();
    setPosts(posts);
    setLoadingPage(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loadingPage) return <Loading height='100%' />;

  return (
    <div className='left w-12/12 px-2'>
      {posts.map((post) => (
        <Post key={post.postId} post={post} />
      ))}
    </div>
  );
};

export default PostView;
