import React, { useEffect, useRef, useState } from 'react';
import { Modal } from 'antd';
import CommentComponent from '../Comment';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import MoreOption from './MoreOption';
import MoreOptionSelf from './MoreOptionSelf';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookmark,
  faEarthAmericas,
  faLock,
  faUserGroup,
} from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { formatCaption, formatDate } from '@/utils';
import LongUserCard from '../LongUserCard';
import {
  fetchPostById,
  getLikesOfPost,
  removeAPostFromSaved,
  saveAPost,
} from '@/services/postService';
import { fetchCommentOfPost, postComment } from '@/services/commentService';
import { comment, post, user } from '@/type/type';
import EmojiPickerComponent from '../EmojiPicker/EmojiPicker';
import MediaSlider from '../MediaSlider';
import { faBookmark as faBookmarkSaved } from '@fortawesome/free-regular-svg-icons';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import PostNotFound from './PostNotFound';
import styles from './PostDetail.module.scss';

type reaction = {
  userId: string;
  postId: string;
  liked: boolean;
};

const PostDetail = ({ postId, border = false }: { postId: string; border: boolean }) => {
  let timeoutId: string | number | NodeJS.Timeout | undefined;
  const [replyCommentId, setReplyCommentId] = useState('');
  const [liked, setLiked] = useState(false);
  const [likeNumber, setLikeNumber] = useState(0);
  const [post, setPost] = useState<post>();
  const [comments, setComments] = useState<comment[]>([]);

  const [isOpenModalLikeList, setIsOpenModalLikeList] = useState(false);
  const [likeList, setLikeList] = useState<user[]>([]);

  const [isSaved, setIsSaved] = useState(false);

  const currentUser = useSelector((state: RootState) => state.user.user);

  const commentRef = useRef<HTMLDivElement>(null);

  const handlePostComment = async () => {
    if (!commentRef.current?.innerText) {
      return;
    }
    await postComment(postId, commentRef.current.innerText, replyCommentId);
    const comments: comment[] = await fetchCommentOfPost(postId);
    setComments(comments);
    if (commentRef.current) {
      commentRef.current.innerText = '';
    }
    setReplyCommentId('');
  };

  const likeClick = async () => {
    if (liked === false) {
      setLikeNumber(likeNumber + 1);
      setLiked(true);
    } else {
      setLikeNumber(likeNumber - 1);
      setLiked(false);
    }
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(likeAPI, 3000);
  };
  const likeAPI = async () => {
    if (liked === false) {
      const response = await fetch(`${process.env.API}/api/v1/post/${postId}/like`, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });
      if (response.status == 200) {
        const data = await response.json();
        // setLiked(data.data.liked);
        await getLikeNumber();
      } else if (response.status === 401) {
        console.log('JWT expired');
      }
    } else if (liked === true) {
      const response = await fetch(`${process.env.API}/api/v1/post/${postId}/like`, {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });
      if (response.status == 200) {
        const data = await response.json();
        // setLiked(data.data.liked);
        await getLikeNumber();
      } else if (response.status === 401) {
        console.log('JWT expired');
      }
    }
  };

  const getLikeNumber = async () => {
    const response = await fetch(`${process.env.API}/api/v1/post/${postId}`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    });
    if (response.status == 200) {
      const data = await response.json();
      setLikeNumber(data.data.reactions.length);
    } else if (response.status === 401) {
      console.log('JWT expired');
    }
  };

  const handleLikeClick = async () => {
    likeClick();
  };

  const fetchPostDetail = async () => {
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
      const post: post = await fetchPostById(postId);
      setPost(post);
      if (!post) {
        return;
      }
      setIsSaved(post.saved);
      const reaction: reaction = await fetchLiked(post.postId);
      setLiked(reaction.liked);
      setLikeNumber(post.reactions.length);
      const comments: comment[] = await fetchCommentOfPost(postId);
      setComments(comments);
    }
  };

  useEffect(() => {
    fetchPostDetail();
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

  const onReply = (comment: comment) => {
    if (commentRef.current) {
      commentRef.current.innerText = `@${comment?.user.username}${String.fromCharCode(160)}`;
      // Focus vào cuối dòng
      const range = document.createRange();
      const selection = window.getSelection();
      const childNodes = commentRef.current.childNodes;
      const lastNode = childNodes[childNodes.length - 1] as HTMLElement;

      if (lastNode && lastNode.textContent) {
        range.setStart(lastNode, lastNode.textContent.length);
        range.collapse(true);

        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }

      commentRef.current.focus();
    }
    if (comment.repliedCommentId) {
      setReplyCommentId(comment.repliedCommentId);
    } else {
      setReplyCommentId(comment.id);
    }
  };

  const handleSaveOrUnSaveAPost = () => {
    setIsSaved((prev) => {
      if (prev) {
        removeAPostFromSaved(postId);
      } else {
        saveAPost(postId);
      }
      return !prev;
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      if (event.shiftKey) {
        document.execCommand('insertHTML', false, '<br><br>');
        event.preventDefault();
      } else {
        event.preventDefault();
        handlePostComment();
      }
    }
  };

  if (!post) {
    return <PostNotFound />;
  }

  return (
    <>
      <div className={`${border && 'border-1 rounded-sm'}`}>
        <div
          className='relative'
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            height: '80vh',
            gap: '16px',
          }}
        >
          <div className='feed-img' style={{ flex: 1 }}>
            <MediaSlider files={post.files} />
          </div>
          <div className='header flex-1 max-h-full'>
            <div className='flex flex-col h-full max-h-full'>
              <div className='header py-2 px-2 flex justify-between items-center'>
                <div className='flex flex-col gap-2'>
                  <div className='left flex flex-row items-center'>
                    <a
                      className='user-img h-10 w-10 border rounded-full overflow-hidden mr-4'
                      href={`/profile/${post?.user.username}`}
                    >
                      <img
                        alt='avatar'
                        className='_6q-tv'
                        draggable='false'
                        src={post?.user.avatar}
                      />
                    </a>
                    <a
                      className='user-name-and-place flex flex-col no-underline text-gray-900 hover:text-gray-400'
                      href={`/profile/${post?.user.username}`}
                    >
                      <span className='text-sm font-bold'>{post?.user.username}</span>
                      <span className='text-xs font-light text-gray-900'></span>
                    </a>
                    {post?.createdAt !== post?.updatedAt ? (
                      <>
                        <svg
                          aria-label='More options'
                          className='_8-yf5 '
                          fill='darkgrey'
                          height='16'
                          viewBox='0 0 48 48'
                          width='16'
                        >
                          <circle
                            clipRule='evenodd'
                            cx='24'
                            cy='24'
                            fillRule='evenodd'
                            r='4.5'
                          ></circle>
                        </svg>
                        <span style={{ color: 'darkgray' }}>Đã chỉnh sửa</span>
                      </>
                    ) : undefined}
                    <svg
                      aria-label='More options'
                      className='_8-yf5 '
                      fill='darkgrey'
                      height='16'
                      viewBox='0 0 48 48'
                      width='16'
                    >
                      <circle
                        clipRule='evenodd'
                        cx='24'
                        cy='24'
                        fillRule='evenodd'
                        r='4.5'
                      ></circle>
                    </svg>
                    {post?.postMode == 'PUBLIC' ? (
                      <FontAwesomeIcon
                        icon={faEarthAmericas as IconProp}
                        size='sm'
                        style={{ color: 'darkgrey' }}
                      />
                    ) : post?.postMode == 'FRIEND' ? (
                      <FontAwesomeIcon
                        icon={faUserGroup as IconProp}
                        size='sm'
                        style={{ color: 'darkgrey' }}
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faLock as IconProp}
                        size='sm'
                        style={{ color: 'darkgrey' }}
                      />
                    )}
                  </div>
                </div>
                <div className='right'>
                  {currentUser.id === post?.user.userId ? (
                    <MoreOptionSelf post={post} />
                  ) : (
                    // <MoreOption post={post} />
                    <></>
                  )}
                </div>
              </div>

              <div className='flex flex-column flex-1 overflow-y-scroll no-scrollbar'>
                <div className='prose max-w-screen-md'>
                  <div className='pl-16 pb-2 border-b'>
                    {post?.caption != '' && (
                      <div className='text-sm font-light text-gray-900 whitespace-pre-line	'>
                        {post && formatCaption(post.caption)}
                      </div>
                    )}
                  </div>
                  <div>
                    {comments?.map((comment, id) => (
                      <CommentComponent
                        key={id}
                        comment={comment}
                        onReply={onReply}
                      ></CommentComponent>
                    ))}
                  </div>
                </div>
              </div>
              <div className='card-footer sticky bottom-0 bg-white'>
                <div className='top border-t mt-2 pt-3 pl-2 pr-2'>
                  <div className='icons flex flex-row justify-between items-center'>
                    <div className='left flex flex-row w-full'>
                      <button onClick={handleLikeClick}>
                        <div className='like mr-4'>
                          {liked === true ? (
                            <HeartFilled style={{ fontSize: '25px', color: '#FF2F41' }} />
                          ) : (
                            <HeartOutlined style={{ fontSize: '25px' }} />
                          )}
                        </div>
                      </button>
                      <button className='flex-1' onClick={handleSaveOrUnSaveAPost}>
                        <div className='text-right'>
                          {!isSaved ? (
                            <FontAwesomeIcon size='xl' icon={faBookmarkSaved} />
                          ) : (
                            <FontAwesomeIcon size='xl' icon={faBookmark} />
                          )}
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
                      {likeNumber} likes
                    </span>
                  </div>
                  <div className='post-date mt-1'>
                    <span className='text-xs text-gray-900'>{formatDate(post.createdAt)}</span>
                  </div>
                </div>
                <div className='bottom border-t py-2 mt-3 pl-2 pr-2'>
                  <div className='wrapper flex items-center justify-center gap-3 py-1'>
                    <EmojiPickerComponent divRef={commentRef} />
                    <div className={styles['input-chat-wrapper']}>
                      <div
                        ref={commentRef}
                        contentEditable='true'
                        onKeyDown={handleKeyDown}
                        placeholder='Thêm bình luận'
                      />
                    </div>

                    <button
                      className='text-blue-a text-right font-semibold'
                      onClick={handlePostComment}
                    >
                      Đăng
                    </button>

                    {/* <input
                      ref={commentRef}
                      type='text'
                      className='text-sm h-10 w-full outline-none focus:outline-none w-10/12 p-4'
                    /> */}
                    {/* <button
                      className='text-blue-a w-2/12 text-right font-semibold'
                      onClick={handlePostComment}
                    >
                      Đăng
                    </button> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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

export default PostDetail;
