import { post, user } from '@/type/type';
import { formatCaption, formatDate } from '@/utils';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faEarthAmericas, faLock, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { RefObject, useEffect, useRef, useState } from 'react';
import ActionComponent from './Action';
import MediaSlider from '../MediaSlider';
import MoreOption from './MoreOption';

const Post = ({ post }: { post: post }) => {
  const user = post.user;

  const [mediaWidth, setMediaWidth] = useState<number>(0);

  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mediaRef.current && setMediaWidth(mediaRef.current.clientWidth);
  }, [mediaRef]);

  return (
    <div className='feeds'>
      <div className='feed-wrapper mb-4'>
        <div className='feed-item border border-gray-400 rounded bg-white'>
          <div className='header border-b p-4 flex justify-between items-center'>
            <div className='left flex flex-row items-center'>
              <a
                className='user-img h-10 w-10 border rounded-full overflow-hidden mr-4'
                href={`/profile/${user?.username}`}
              >
                <img alt='avatar' className='_6q-tv' draggable='false' src={user?.avatar} />
              </a>
              <a
                className='user-name-and-place flex flex-col no-underline text-gray-900 hover:text-gray-400'
                href={`/profile/${user?.username}`}
              >
                <span className='text-sm font-bold'>{user?.username}</span>
                <span className='text-xs font-light text-gray-900'></span>
              </a>

              {post.createdAt !== post.updatedAt ? (
                <>
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
                  <span style={{ color: 'darkgray' }}>Đã chỉnh sửa</span>
                </>
              ) : undefined}
              <svg
                aria-label=''
                className='_8-yf5 '
                fill='darkgrey'
                height='16'
                viewBox='0 0 48 48'
                width='16'
              >
                <circle clipRule='evenodd' cx='24' cy='24' fillRule='evenodd' r='4.5' />
              </svg>
              {post.postMode == 'PUBLIC' ? (
                <FontAwesomeIcon
                  icon={faEarthAmericas as IconProp}
                  size='sm'
                  style={{ color: 'darkgrey' }}
                />
              ) : post.postMode == 'FRIEND' ? (
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
            {/* <div className='right'>
              <MoreOption postId={post.postId}></MoreOption>
            </div> */}
          </div>
          <div ref={mediaRef} className='feed-img'>
            <MediaSlider fixedWidth={mediaWidth} files={post.files} />
          </div>
          <div className='card-footer p-4'>
            <div className='top'>
              <ActionComponent post={post} />
              <div className='caption text-sm mt-3 whitespace-pre-line'>
                <b>{user?.username} </b>
                {formatCaption(post.caption)}
              </div>
              <div className='post-date mt-1'>
                <span className='text-xs text-gray-900'>{formatDate(post.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
