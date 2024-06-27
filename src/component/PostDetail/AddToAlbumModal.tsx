import { addPostToAlbum, fetchAlbumsByUserId } from '@/services/albumService';
import { RootState } from '@/store';
import { album } from '@/type/type';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, message, Modal, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AddNewAlbumModal from '../AddNewAlbumModal/AddNewAlbumModal';

const albumSelectionInit = [
  { value: 'none', label: 'Không' },
  {
    value: 'new',
    label: (
      <span className='text-green-600'>
        <FontAwesomeIcon icon={faPlus as IconProp} size='sm' /> Thêm album
      </span>
    ),
  },
];

const AddToAlbumModal = ({
  postId,
  isModalOpen,
  setIsModalOpen,
  album,
}: {
  postId: string;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  album?: string;
}) => {
  const [albums, setAlbums] = useState(albumSelectionInit);
  const [selectedAlbum, setSelectedAlbum] = useState(album || albumSelectionInit[0].value);
  const [isOpenNewAlbum, setIsOpenNewAlbum] = useState(false);

  const currentUser = useSelector((state: RootState) => state.user.user);

  const [messageApi, contextHolder] = message.useMessage();
  const notify = (type: any, message: string) => {
    messageApi.open({
      type: type,
      content: message,
    });
  };

  const handleOk = async () => {
    await addPostToAlbum(selectedAlbum, postId);
    notify('success', 'Đã thêm vào album');
    handleCancel();
  };

  const handleCancel = () => {
    setSelectedAlbum(albumSelectionInit[0].value);
    setIsModalOpen(false);
  };

  const loadAlbumSelection = async () => {
    const data: album[] = await fetchAlbumsByUserId(currentUser.id);
    const albumsOption = data.map((abum) => {
      return { value: abum.id, label: <span className='capitalize'>{abum.name}</span> };
    });
    setAlbums([albumSelectionInit[0], ...albumsOption, albumSelectionInit[1]]);
  };

  // this function add new album at end of list and select it after new album submited and created
  const onAddNewAlbumComplete = ({ id, name }: album) => {
    setAlbums((prev) => {
      prev.pop();
      return [
        ...prev,
        { value: id, label: <span className='capitalize'>{name}</span> },
        albumSelectionInit[1],
      ];
    });
    setSelectedAlbum(id);
  };

  const handleChangeAlbum = (value: string) => {
    if (value === albumSelectionInit[1].value) {
      setIsOpenNewAlbum(true);
    } else {
      setSelectedAlbum(value);
    }
  };

  useEffect(() => {
    loadAlbumSelection();
  }, []);

  return (
    <>
      {contextHolder}
      <Modal
        title={<div className='w-full flex  font-bold text-lg'>Thêm bài viết vào album</div>}
        open={isModalOpen}
        // onOk={handleOk}
        onCancel={handleCancel}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <Button onClick={handleCancel}>Hủy</Button>
            <Button
              type='primary'
              onClick={handleOk}
              disabled={selectedAlbum === albumSelectionInit[0].value}
            >
              Thêm
            </Button>
          </>
        )}
      >
        <Select
          value={selectedAlbum}
          style={{ width: 150 }}
          onChange={handleChangeAlbum}
          options={albums}
        />
      </Modal>
      <AddNewAlbumModal
        open={isOpenNewAlbum}
        setOpen={setIsOpenNewAlbum}
        onAddNewAlbumComplete={onAddNewAlbumComplete}
      />
    </>
  );
};

export default AddToAlbumModal;
