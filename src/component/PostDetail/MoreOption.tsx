import { post } from '@/type/type';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Dropdown, MenuProps, Modal } from 'antd';

const { confirm } = Modal;

const MoreOption = ({ post }: { post: post }) => {
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
    // <></>
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
};

export default MoreOption;
