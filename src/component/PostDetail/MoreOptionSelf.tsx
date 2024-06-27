import { ExclamationCircleFilled } from '@ant-design/icons';
import { Dropdown, MenuProps, Modal } from 'antd';
import { useState } from 'react';
import EditPost from '../edit-post';
import AddToAlbumModal from './AddToAlbumModal';
import { post } from '@/type/type';
import { removePostFromAlbum } from '@/services/albumService';

const { confirm } = Modal;

const MoreOptionSelf = ({ post }: { post: post }) => {
  const [editPost, setEditPost] = useState(false);
  const [isOpenAddAlbumModal, setIsOpenAddAlbumModal] = useState(false);

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

  const openAddAlbumModal = () => {
    setIsOpenAddAlbumModal(true);
  };

  const removeFromAlbum = async () => {
    await removePostFromAlbum(post.postId);
  };

  const showConfirmRemovePostFromAlbum = () => {
    confirm({
      title: 'Bạn có chắc là muốn loại bỏ bài viết này khỏi album không?',
      icon: <ExclamationCircleFilled />,
      content: '',
      okText: 'Có',
      okType: 'danger',
      cancelText: 'Không',
      onOk() {
        removeFromAlbum();
      },
      onCancel() {},
    });
  };

  const items: MenuProps['items'] = [
    {
      label: <a onClick={openAddAlbumModal}>{post.album ? 'Chuyển album' : 'Thêm vào album'}</a>,
      key: '0',
    },
    ...(post.album
      ? [
          {
            label: <a onClick={showConfirmRemovePostFromAlbum}>Xóa khỏi album</a>,
            key: '1',
          },
        ]
      : []),
    {
      label: <a onClick={openEditModal}>Chỉnh sửa bài viết</a>,
      key: '2',
    },
    {
      label: <a onClick={showDeleteConfirm}>Xóa bài viết</a>,
      key: '3',
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
      <EditPost editPost={editPost} setEditPost={setEditPost} post={post} user={post.user} />
      <AddToAlbumModal
        postId={post.postId}
        isModalOpen={isOpenAddAlbumModal}
        setIsModalOpen={setIsOpenAddAlbumModal}
        album={post.album?.id}
      />
    </>
  );
};

export default MoreOptionSelf;
