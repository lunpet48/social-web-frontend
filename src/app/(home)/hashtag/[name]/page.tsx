'use client';
import PostProfileComponent from '@/component/PostProfileComponent';
import { getPostsOfHashtag } from '@/services/hashtagService';
import { post } from '@/type/type';
import { Col, Row } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const HashTagPage = ({ params }: { params: { name: string } }) => {
  const [posts, setPosts] = useState<post[]>([]);
  const router = useRouter();

  const fetchPostsOfHashtag = async () => {
    try {
      const response = await getPostsOfHashtag(params.name);
      if (response.status >= 200 && response.status < 300) {
        const payload = await response.json();
        setPosts(payload.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchPostsOfHashtag();
  }, []);

  return (
    <>
      <div>
        <Row style={{ background: 'white', paddingTop: '20px' }}>
          <Col xs={{ span: 24 }} md={{ span: 20, offset: 2 }} lg={{ span: 16, offset: 4 }}>
            <div style={{ display: 'flex' }}>
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ fontSize: '30px' }}>#{params.name}</div>
                <div style={{ fontSize: '18px' }}>{posts.length} bài viết</div>
              </div>
            </div>
            <div style={{ marginTop: '20px' }}>
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
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default HashTagPage;
