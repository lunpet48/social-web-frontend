import { useEffect, useState } from 'react';
import '../index.css';
import Loading from '@/component/Loading';
import { paging, post } from '@/type/type';
import { getPosts } from '@/services/postService';
import Post from '../Post/Post';
import useElementOnScreen from '@/hooks/useElementOnScreen';

const PostView = () => {
  const [posts, setPosts] = useState<post[]>([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const [paging, setPaging] = useState<paging>({ pageNo: 0, pageSize: 3 });

  const { ref, isVisible } = useElementOnScreen();

  const fetchPosts = async (paging: paging) => {
    const posts: post[] = await getPosts(paging);
    if (posts.length === 0) {
      setIsEnd(true);
    } else {
      setPosts((prev) => [...prev, ...posts]);
    }
  };

  // fetch post one when visit home page
  useEffect(() => {
    fetchPosts(paging).then(() => setLoadingPage(false));
  }, []);

  // load more post when scroll down
  useEffect(() => {
    if (isVisible) {
      setPaging((prev) => {
        const nextPage = { ...prev, pageNo: prev.pageNo + 1 };
        fetchPosts(nextPage);
        return nextPage;
      });
    }
  }, [ref, isVisible]);

  if (loadingPage) return <Loading height='100%' />;

  return (
    <div className='left w-12/12 px-2'>
      {posts.map((post) => (
        <Post key={post.postId} post={post} />
      ))}
      {!isEnd && (
        <div style={{ position: 'relative' }}>
          <Loading height='50px' />
          <div
            ref={ref as React.RefObject<HTMLDivElement>}
            style={{ position: 'absolute', top: '-500px' }}
          />
        </div>
      )}
    </div>
  );
};

export default PostView;
