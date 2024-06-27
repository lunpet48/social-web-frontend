import { useState } from 'react';
import { changeAlbumName, deleteAlbum } from '@/services/albumService';
import { album } from '@/type/type';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { TextField } from '@mui/material';
import { Col, Dropdown, MenuProps, Modal } from 'antd';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';

import styles from './albums.module.scss';

const AlbumViewComponent = ({
  album,
  reload,
  hideOption,
}: {
  album: album;
  reload: () => void;
  hideOption: boolean;
}) => {
  const [openChangeAlbumNameModel, setOpenChangeAlbumNameModel] = useState(false);
  const [albumName, setAlbumName] = useState(album.name);

  const { confirm } = Modal;

  const router = useRouter();

  const itemsDropdown: MenuProps['items'] = [
    {
      label: (
        <a
          style={{ fontSize: '16px' }}
          onClick={(e) => {
            confirm({
              title: 'Bạn có chắc muốn xóa?',
              icon: <ExclamationCircleFilled />,
              content: '',
              okText: 'Có',
              okType: 'danger',
              cancelText: 'Không',
              onOk() {
                handleDeleteAlbum(e, album.id);
              },
              onCancel() {},
            });
          }}
        >
          Xóa album
        </a>
      ),
      key: '0',
    },
    {
      label: (
        <a
          style={{ fontSize: '16px' }}
          onClick={(e) => {
            showChangeAlbumNameModel(e);
          }}
        >
          Đổi tên
        </a>
      ),
      key: '1',
    },
  ];

  const handleDeleteAlbum = async (event: React.MouseEvent<HTMLElement>, id: string) => {
    event.stopPropagation();
    const response = await deleteAlbum(id);

    if (response.status >= 200 && response.status < 300) {
      //succcess
      reload();
    }
  };

  const onChangeAlbumName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAlbumName(e.target.value);
  };

  const handleOk = async () => {
    const data = await changeAlbumName(album.id, albumName);
    handleCancel();
    reload();
  };

  const handleCancel = () => {
    setAlbumName('');
    setOpenChangeAlbumNameModel(false);
  };

  const showChangeAlbumNameModel = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setOpenChangeAlbumNameModel(true);
  };
  return (
    <>
      <Col
        xs={8}
        onClick={() => {
          router.push(`/albums/${album.id}`);
        }}
      >
        <div className={`${styles['album-wrapper']} noselect`}>
          <img src={album.img || '/image_holder.jpg'} alt='' />
          <div className={styles['album-description']}>{album.name}</div>
          <div className={styles['overlay']}>
            <div
              hidden={hideOption}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Dropdown menu={{ items: itemsDropdown }} trigger={['click']} placement='bottomRight'>
                <div className={styles['show-more-btn']}>
                  <FontAwesomeIcon style={{ fontSize: '24px' }} icon={faEllipsis} />
                </div>
              </Dropdown>
            </div>
          </div>
        </div>
      </Col>
      <Modal
        title={<div className='w-full flex justify-center font-bold text-lg'>Đổi tên album</div>}
        open={openChangeAlbumNameModel}
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

export default AlbumViewComponent;
