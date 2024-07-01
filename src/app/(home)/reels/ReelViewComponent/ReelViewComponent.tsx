import VideoPlayerComponent from '@/component/VideoPlayerComponent';
import styles from './ReelViewComponent.module.scss';
import { post } from '@/type/type';
import { CommentOutlined, HeartFilled, HeartOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkSaved } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  dislikePost,
  getIsLikedPost,
  getLikesOfPost,
  likePost,
  removeAPostFromSaved,
  saveAPost,
} from '@/services/postService';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';

const ReelViewComponent = ({ reel }: { reel: post }) => {
  const [isSaved, setIsSaved] = useState<boolean>(reel.saved);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  const router = useRouter();

  const handleSaveOrUnSaveAPost = () => {
    setIsSaved((prev) => {
      if (prev) {
        removeAPostFromSaved(reel.postId);
      } else {
        saveAPost(reel.postId);
      }
      return !prev;
    });
  };

  const handleLikeOrDislikePost = () => {
    setIsLiked((prev) => {
      if (prev) {
        dislikePost(reel.postId);
      } else {
        likePost(reel.postId);
      }
      return !prev;
    });
  };

  const fetchIsLiked = async () => {
    const data = await getIsLikedPost(reel.postId);
    setIsLiked(data.liked);
  };

  useEffect(() => {
    fetchIsLiked();
  }, []);

  return (
    <div className={styles['reel']}>
      <div className={styles['video']}>
        <VideoPlayerComponent src={reel.files[0]} />
        <div className={styles['description']}>
          <a href={`/profile/${reel.user.username}`}>
            <img alt='avatar' draggable='false' src={reel.user.avatar} />
            <div>{reel.user.username}</div>
          </a>
          <div>{reel.caption}</div>
        </div>
      </div>
      <div className={styles['buttons']}>
        <button onClick={handleLikeOrDislikePost}>
          {isLiked ? (
            <HeartFilled style={{ fontSize: '25px', color: '#FF2F41' }} />
          ) : (
            <HeartOutlined style={{ fontSize: '25px' }} />
          )}
        </button>
        <CommentOutlined
          style={{ fontSize: '25px' }}
          onClick={() => {
            router.push(`/post/${reel.postId}`, { scroll: false });
          }}
        />
        <button onClick={handleSaveOrUnSaveAPost}>
          {isSaved ? (
            <FontAwesomeIcon size='xl' icon={faBookmarkSaved} />
          ) : (
            <FontAwesomeIcon size='xl' icon={faBookmark} />
          )}
        </button>
        <FontAwesomeIcon size='xl' icon={faEllipsis} />
      </div>
    </div>
  );
};

export default ReelViewComponent;
