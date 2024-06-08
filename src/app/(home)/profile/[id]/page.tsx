'use client';
import Loading from '@/component/Loading';
import PostProfileComponent from '@/component/PostProfileComponent';
import { fetchPostByUsername } from '@/services/postService';
import { post } from '@/type/type';
import { Col, Row } from 'antd';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import TabsContext from './context';
import tabs from './tabs';

const ProfilePage = ({ params }: { params: { id: string } }) => {
  const [posts, setPosts] = useState<post[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { setSelectedTab } = useContext(TabsContext);

  setSelectedTab(tabs[0].name);

  const fetchPost = async (userId: string) => {
    setLoading(true);
    const data = await fetchPostByUsername(userId);
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPost(params.id);
  }, []);

  if (loading) {
    return <Loading height='50px' />;
  }

  return (
    <Row gutter={[3, 3]}>
      {posts.map((post, id) => (
        <Col xs={8} key={id}>
          <PostProfileComponent
            src={`${post.files[0]}`}
            onClick={() => {
              router.push(`/post/${post.postId}`, { scroll: false });
            }}
            likeNumber={post.reactions.length}
            commentNumber={0}
          />
        </Col>
      ))}
    </Row>
  );
};

export default ProfilePage;
