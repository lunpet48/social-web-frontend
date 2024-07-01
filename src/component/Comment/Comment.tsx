import { comment } from '@/type/type';
import { formatCaption, formatDate } from '@/utils';
import { Space } from 'antd';
import { useState } from 'react';

const CommentComponent = ({
  comment,
  onReply,
}: {
  comment: comment;
  onReply: (comment: comment) => void;
}) => {
  const [showSubComment, setShowSubComment] = useState(false);
  return (
    <>
      <div className='content pl-2 pr-2 pt-3  flex'>
        <div className='left flex flex-row'>
          <a
            className='user-img h-10 w-10 border rounded-full overflow-hidden mr-4'
            href={`/profile/${comment.user.username}`}
          >
            <img alt='avatar' className='_6q-tv' draggable='false' src={comment.user.avatar} />
          </a>
        </div>
        <div className='user-name-and-place mt-2 flex justify-stretch'>
          <a
            className='user-name-and-place no-underline text-gray-900 hover:text-gray-400 mr-1'
            href={`/profile/${comment.user.username}`}
          >
            <span className='text-sm font-bold'>{comment.user.username}</span>
          </a>
          <span className='text-sm font-light text-gray-900 whitespace-pre-line'>
            {formatCaption(comment.comment)}
          </span>
        </div>
      </div>
      <div className='flex ml-14'>
        <Space>
          <span className='text-sm font-light text-gray-900 pl-2'>
            {formatDate(comment.createdAt)}
          </span>
          <a
            onClick={() => {
              onReply(comment);
            }}
          >
            Trả lời
          </a>
        </Space>
      </div>
      {comment.subComments?.length > 0 && (
        <>
          <div onClick={() => setShowSubComment((prev) => !prev)} className='ml-16 cursor-pointer'>
            {showSubComment ? `Ẩn câu trả lời` : `Xem câu trả lời (${comment.subComments.length})`}
          </div>
          <div className='ml-14'>
            {showSubComment &&
              comment.subComments.map((subComment, id) => (
                <CommentComponent
                  key={id}
                  comment={subComment}
                  onReply={onReply}
                ></CommentComponent>
              ))}
          </div>
        </>
      )}
    </>
  );
};
export default CommentComponent;
