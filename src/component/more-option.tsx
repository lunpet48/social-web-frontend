import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Dropdown, MenuProps, Modal } from 'antd';
import { useState } from 'react';
import EditPost from './edit-post';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';

const { confirm } = Modal;

const MoreOption = ({ post, user, userId }: any) => {
  const currentUser = useSelector((state: RootState) => state.user.user);
  const [editPost, setEditPost] = useState(false);

  const deletePost = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      const deletePostAPI = async () => {
        const response = await fetch(`${process.env.API}/api/v1/post/${post.postId}`, {
          method: 'DELETE',
          headers: {
            Authorization: 'Bearer ' + token,
          },
        });
        if (response.status === 200) {
          const data = await response.json();
          return data.data;
        } else if (response.status === 401) {
          console.log('JWT expired');
        }
      };
      await deletePostAPI();
    }
  };

  if (currentUser.id === userId) {
    const openEditModal = () => {
      setEditPost(true);
    };

    const showDeleteConfirm = () => {
      confirm({
        title: 'Bạn có chắc là muốn xóa bài viết này không?',
        icon: <ExclamationCircleFilled />,
        content: '',
        okText: 'Có',
        okType: 'danger',
        cancelText: 'Không',
        onOk() {
          deletePost();
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    };

    const items: MenuProps['items'] = [
      {
        label: <a onClick={openEditModal}>Chỉnh sửa bài viết</a>,
        key: '0',
      },
      {
        label: <a onClick={showDeleteConfirm}>Xóa bài viết</a>,
        key: '1',
      },
    ];
    return (
      <>
        <Dropdown menu={{ items }} trigger={['click']}>
          <a onClick={(e) => e.preventDefault()}>
            <svg
              aria-label='More options'
              className='_8-yf5 '
              fill='#262626'
              height='16'
              viewBox='0 0 48 48'
              width='16'
            >
              <circle clipRule='evenodd' cx='8' cy='24' fillRule='evenodd' r='4.5'></circle>
              <circle clipRule='evenodd' cx='24' cy='24' fillRule='evenodd' r='4.5'></circle>
              <circle clipRule='evenodd' cx='40' cy='24' fillRule='evenodd' r='4.5'></circle>
            </svg>
          </a>
        </Dropdown>
        <EditPost editPost={editPost} setEditPost={setEditPost} post={post} user={user}></EditPost>
        {/* <EditPost editPost={editPost} setEditPost={setEditPost} post={post} user={user}></EditPost> */}
      </>
    );
  } else {
    const showDeleteConfirm = () => {
      confirm({
        title: 'Bạn có chắc là muốn hủy kết bạn với người này không?',
        icon: <ExclamationCircleFilled />,
        content: '',
        okText: 'Có',
        okType: 'danger',
        cancelText: 'Không',
        onOk() {},
        onCancel() {
          console.log('Cancel');
        },
      });
    };

    const items: MenuProps['items'] = [
      {
        label: <a onClick={showDeleteConfirm}>Hủy kết bạn</a>,
        key: '0',
      },
    ];
    return (
      <Dropdown menu={{ items }} trigger={['click']}>
        <a onClick={(e) => e.preventDefault()}>
          <svg
            aria-label='More options'
            className='_8-yf5 '
            fill='#262626'
            height='16'
            viewBox='0 0 48 48'
            width='16'
          >
            <circle clipRule='evenodd' cx='8' cy='24' fillRule='evenodd' r='4.5'></circle>
            <circle clipRule='evenodd' cx='24' cy='24' fillRule='evenodd' r='4.5'></circle>
            <circle clipRule='evenodd' cx='40' cy='24' fillRule='evenodd' r='4.5'></circle>
          </svg>
        </a>
      </Dropdown>
    );
  }
};

export default MoreOption;
