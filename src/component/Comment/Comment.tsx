import { comment } from '@/type/type';
import { Space } from 'antd';

const CommentComponent = ({
  comment,
  onReply,
}: {
  comment: comment;
  onReply: (comment: comment) => void;
}) => {
  return (
    <>
      <div className='content pl-2 pr-2 pt-4 pb-2 flex'>
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
          <span className='text-sm font-light text-gray-900'>{comment.comment}</span>
        </div>
      </div>
      <div className='flex ml-14'>
        <Space>
          <span className='text-sm font-light text-gray-900'>
            {new Date(comment.createdAt).toLocaleString()}
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
    </>
  );
};
export default CommentComponent;
