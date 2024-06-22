import { Modal } from 'antd';
import React, { SetStateAction, useState } from 'react';
import { TextField } from '@mui/material';
import { createNewAlbum } from '@/services/albumService';
import { album } from '@/type/type';

const AddNewAlbumModal = ({
  open,
  setOpen,
  onAddNewAlbumComplete,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onAddNewAlbumComplete: ({ id, name }: album) => void;
}) => {
  const [albumName, setAlbumName] = useState('');

  const handleOk = async () => {
    const data = await createNewAlbum(albumName);
    onAddNewAlbumComplete(data);
    handleCancel();
  };

  const handleCancel = () => {
    setAlbumName('');
    setOpen(false);
  };

  const onChangeAlbumName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAlbumName(e.target.value);
  };

  return (
    <>
      <Modal
        title={<div className='w-full flex justify-center font-bold text-lg'>Tạo album</div>}
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <TextField
          label='Tên album'
          variant='outlined'
          fullWidth
          value={albumName}
          onChange={onChangeAlbumName}
        />
      </Modal>
    </>
  );
};

export default AddNewAlbumModal;
