'use client';
import Loading from '@/component/Loading';
import PostProfileComponent from '@/component/PostProfileComponent';
import { fetchPostsOfAlbum } from '@/services/albumService';
import { post } from '@/type/type';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Row } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';

const AlbumDetail = ({ params: { albumid } }: { params: { albumid: string } }) => {
  const [posts, setPosts] = useState<post[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchPost = async () => {
    setLoading(true);
    const data = await fetchPostsOfAlbum(albumid);
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPost();
  }, []);

  if (loading) {
    return <Loading height='50px' />;
  }

  return (
    <div>
      <div className='bg-blue-500 h-12 text-white text-2xl pl-2 flex gap-2 items-center '>
        <FontAwesomeIcon icon={faArrowLeft} onClick={() => router.back()} />
        Album
      </div>
      <Row gutter={[3, 3]} justify='center'>
        {posts?.map((post, id) => (
          <Col xs={5} key={id}>
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
  );
};

export default AlbumDetail;
