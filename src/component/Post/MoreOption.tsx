import { Dropdown, MenuProps, Modal } from 'antd';
import { useState } from 'react';
import AddReportModal from '../AddReportModal/AddReportModal';

const { confirm } = Modal;

const MoreOption = ({ postId }: { postId: string }) => {
  const [isOpenReportModal, setIsOpenReportModal] = useState(false);

  const items: MenuProps['items'] = [
    {
      label: (
        <a
          onClick={() => {
            setIsOpenReportModal(true);
          }}
        >
          Báo cáo bài viết
        </a>
      ),
      key: '0',
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
      <AddReportModal
        open={isOpenReportModal}
        setOpen={setIsOpenReportModal}
        targetId={postId}
        reportType='POST'
      />
    </>
  );
};

export default MoreOption;
