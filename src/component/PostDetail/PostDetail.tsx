import React, { useEffect, useRef, useState } from 'react';
import MediaView from '../media-view';
import { Modal, Space } from 'antd';
import CommentComponent from '../Comment';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import MoreOption from '../more-option';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEarthAmericas, faLock, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { checkMediaType, formatCaption } from '@/utils';
import { MediaType } from '@/type/enum';
import VideoPlayerComponent from '../VideoPlayerComponent';
import LongUserCard from '../LongUserCard';
import { fetchPostById, getLikesOfPost } from '@/services/postService';
import { fetchCommentOfPost, postComment } from '@/services/commentService';
import { comment, post, user } from '@/type/type';
import EmojiPickerComponent from '../EmojiPicker/EmojiPicker';

type reaction = {
  userId: string;
  postId: string;
  liked: boolean;
};

const PostDetail = ({ postId }: { postId: string }) => {
  let timeoutId: string | number | NodeJS.Timeout | undefined;
  const [replyCommentId, setReplyCommentId] = useState('');
  const [liked, setLiked] = useState(false);
  const [likeNumber, setLikeNumber] = useState(0);
  const [post, setPost] = useState<post>();
  const [comments, setComments] = useState<comment[]>([]);

  const [isOpenModalLikeList, setIsOpenModalLikeList] = useState(false);
  const [likeList, setLikeList] = useState<user[]>([]);

  const commentRef = useRef<HTMLInputElement>(null);

  const handlePostComment = async () => {
    console.log('comment', commentRef.current?.value);
    await postComment(postId, commentRef.current?.value || '', replyCommentId);
    // loadComments();
    const comments: comment[] = await fetchCommentOfPost(postId);
    setComments(comments);
    if (commentRef.current) {
      commentRef.current.value = '';
    }
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
      commentRef.current.value = `@${comment?.user.username} `;
    }
    setReplyCommentId(comment?.id);
  };

  return (
    <>
      <div className='relative' style={{ display: 'flex', flexWrap: 'wrap' }}>
        <div className='feed-img' style={{ flex: '50%' }}>
          {post && checkMediaType(post.files[0]) === MediaType.IMAGE ? (
            <MediaView slides={post?.files}></MediaView>
          ) : post && checkMediaType(post.files[0]) === MediaType.VIDEO ? (
            <VideoPlayerComponent src={post.files[0]} />
          ) : (
            <></>
          )}
        </div>
        <div className='header' style={{ flex: '50%' }}>
          <div className='flex grid grid-cols-1'>
            <div className='header border-b pt-4 pb-4 pl-2 pr-2 flex justify-between items-center'>
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
                    <circle clipRule='evenodd' cx='24' cy='24' fillRule='evenodd' r='4.5'></circle>
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
                <div className='pl-14'>
                  {post?.caption != '' && (
                    <span className='text-sm font-light text-gray-900'>
                      {post && formatCaption(post.caption)}
                    </span>
                  )}
                </div>
              </div>
              <div className='right'>
                <MoreOption post={post} user={post?.user} userId={post?.user.userId}></MoreOption>
              </div>
            </div>

            <div className='flex flex-column'>
              <div
                className='prose max-w-screen-md overflow-y-auto'
                style={{ maxHeight: '40vh', backgroundColor: '#fff' }}
              >
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
              <div className='top border-t mt-2 pt-3 pb-3 pl-2 pr-2'>
                <div className='icons flex flex-row justify-between items-center'>
                  <div className='left flex flex-row'>
                    <button onClick={handleLikeClick}>
                      <div className='like mr-4'>
                        {liked === true ? (
                          <HeartFilled style={{ fontSize: '25px', color: '#FF2F41' }} />
                        ) : (
                          <HeartOutlined style={{ fontSize: '25px' }} />
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
                  <span className='text-xs text-gray-900'>
                    {post && new Date(post.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className='bottom border-t pt-3 mt-3'>
                <div className='wrapper flex items-center'>
                  <EmojiPickerComponent inputRef={commentRef} />
                  <input
                    ref={commentRef}
                    type='text'
                    className='text-sm h-10 w-full outline-none focus:outline-none w-10/12 p-4'
                    placeholder='Thêm bình luận'
                  />
                  <button
                    className='text-blue-500 opacity-75 w-2/12 text-right font-bold'
                    onClick={handlePostComment}
                    // disabled={/^\s*$/.test(commentRef.current?.value || '')}
                  >
                    Đăng
                  </button>
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
