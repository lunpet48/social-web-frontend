import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './layout.module.scss';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const MessageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles['content']}>
      <div className={styles['left']}>
        <div className={styles['head']}>
          <div className={styles['title']}>Chats</div>
          <FontAwesomeIcon icon={faPenToSquare} width={22} />
        </div>
        <Input
          placeholder='Tìm kiếm'
          prefix={<SearchOutlined style={{ color: '#666', fontSize: '18px' }} />}
        />
        <div className={styles['messageTabs']}>
          <div className={`${styles['tab']} ${styles['active']}`}>Tin nhắn</div>
          {/* <div className={styles['tab']}>Tin nhắn đang chờ</div> */}
        </div>
      </div>
      <div className={styles['right']}>{children}</div>
    </div>
  );
};

export default MessageLayout;
