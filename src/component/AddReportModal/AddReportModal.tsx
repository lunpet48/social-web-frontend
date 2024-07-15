import { Modal } from 'antd';
import React, { useState } from 'react';
import { TextField } from '@mui/material';
import { sendReport } from '@/services/report';

const AddReportModal = ({
  open,
  setOpen,
  targetId,
  reportType,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  targetId: string;
  reportType: string;
}) => {
  const [description, setDescription] = useState('');

  const handleOk = async () => {
    await sendReport(targetId, description, reportType);
    handleCancel();
  };

  const handleCancel = () => {
    setDescription('');
    setOpen(false);
  };

  const onChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  return (
    <>
      <Modal
        title={
          <div className='w-full flex justify-center font-bold text-lg'>
            Báo cáo {reportType === 'POST' ? 'bài viết' : 'người dùng'}
          </div>
        }
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <TextField
          label='Lý do'
          variant='outlined'
          fullWidth
          value={description}
          onChange={onChangeDescription}
        />
      </Modal>
    </>
  );
};

export default AddReportModal;
