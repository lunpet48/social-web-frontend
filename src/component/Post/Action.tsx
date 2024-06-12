import { CommentOutlined, HeartFilled, HeartOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from 'antd';
import LongUserCard from '../LongUserCard';
import { user } from '@/type/type';
import { getLikesOfPost } from '@/services/postService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';

type reaction = {
  userId: string;
  postId: string;
  liked: boolean;
};

const LikeComponent = ({ postId, numberOfLike }: any) => {
  const [reaction, setReaction] = useState<reaction>({
    userId: '',
    postId: postId,
    liked: false,
  });
  const [isOpenModalLikeList, setIsOpenModalLikeList] = useState(false);
  const [likeList, setLikeList] = useState<user[]>([]);
  let timeoutId: string | number | NodeJS.Timeout | undefined;
  //const [open, setOpen] = useState(false);
  //const { liked, numberOfLike, likeContext } = useLike();
  const [like, setLike] = useState<number>(numberOfLike);
  const router = useRouter();
  const likeClick = async () => {
    if (reaction?.liked === false) {
      setLike(like + 1);
      reaction.liked = true;
      setReaction(reaction);
    } else if (reaction?.liked === true) {
      setLike(like - 1);
      reaction!.liked = false;
      setReaction(reaction);
    }
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(await likeAPI, 2000);
  };
  const likeAPI = async () => {
    if (reaction!.liked === true) {
      const response = await fetch(`${process.env.API}/api/v1/post/${reaction?.postId}/like`, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });
      if (response.status == 200) {
        const data = await response.json();
        setReaction(data.data);
        await likeNumber();
      } else if (response.status === 401) {
        console.log('JWT expired');
      }
    } else if (reaction!.liked === false) {
      const response = await fetch(`${process.env.API}/api/v1/post/${reaction?.postId}/like`, {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });
      if (response.status == 200) {
        const data = await response.json();
        setReaction(data.data);
        await likeNumber();
      } else if (response.status === 401) {
        console.log('JWT expired');
      }
    }
  };
  const likeNumber = async () => {
    const response = await fetch(`${process.env.API}/api/v1/post/${reaction?.postId}`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    });
    if (response.status == 200) {
      const data = await response.json();
      setLike(data.data.reactions.length);
    } else if (response.status === 401) {
      console.log('JWT expired');
    }
  };

  const handleLikeClick = async () => {
    likeClick();
  };
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const fetchLiked = async (postId: string) => {
          const response = await fetch(`${process.env.API}/api/v1/post/${postId}/like`, {
            method: 'GET',
            headers: {
              Authorization: 'Bearer ' + token,
            },
          });
          if (response.status == 200) {
            const data = await response.json();
            return data.data;
          } else if (response.status === 401) {
            console.log('JWT expired');
          }
        };
        const reaction: reaction = await fetchLiked(postId);
        setReaction(reaction);
      }
    };
    fetchData();
  }, []);

  const fetchLikesOfPost = async () => {
    try {
      const response = await getLikesOfPost(postId);
      if (response.status === 200) {
        const data = await response.json();
        setLikeList(data.data);
      }
    } catch (e) {}
  };
  const handleOpenLikeList = () => {
    fetchLikesOfPost();
    setIsOpenModalLikeList(true);
  };

  const handleCancelModalLikeList = () => {
    setIsOpenModalLikeList(false);
  };
  return (
    <>
      <div className='icons flex flex-row justify-between items-center'>
        <div className='left flex flex-row w-full'>
          <button onClick={handleLikeClick}>
            <div className='like mr-4'>
              {reaction.liked === true ? (
                <HeartFilled style={{ fontSize: '25px', color: '#FF2F41' }} />
              ) : (
                <HeartOutlined style={{ fontSize: '25px' }} />
              )}
            </div>
          </button>
          <button
            onClick={() => {
              router.push(`/post/${postId}`, { scroll: false });
            }}
          >
            <div className='comment mr-4'>
              <CommentOutlined style={{ fontSize: '25px' }} />
            </div>
          </button>
          <button className='flex-1' onClick={() => {}}>
            <div className='text-right'>
              <FontAwesomeIcon size='xl' icon={faBookmark} />
            </div>
          </button>
        </div>
      </div>
      <div className='likes mt-1'>
        <span
          style={{ cursor: 'pointer' }}
          onClick={handleOpenLikeList}
          className='font-bold text-sm'
        >
          {like} likes
        </span>
      </div>
      <Modal
        forceRender
        title='Lượt thích'
        open={isOpenModalLikeList}
        onCancel={handleCancelModalLikeList}
        footer={null}
      >
        <div style={{ minHeight: '300px', maxHeight: '370px', overflow: 'auto' }}>
          {likeList.map((user, index) => (
            <LongUserCard key={index} user={user} />
          ))}
        </div>
      </Modal>
    </>
  );
};

export default LikeComponent;
