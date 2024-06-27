import React, { useEffect, useRef, useState } from 'react';
import '../index.css';
import { Button, Modal, Input, Select, Space, message } from 'antd';
import {
  faArrowUpFromBracket,
  faEarthAmericas,
  faLock,
  faPlus,
  faUserGroup,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { postMode } from '@/type/enum';
import MediaSlider from '../MediaSliderForFileUpload';
import { PlusOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { fetchAlbumsByUserId } from '@/services/albumService';
import { album } from '@/type/type';
import AddNewAlbumModal from '../AddNewAlbumModal/AddNewAlbumModal';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

const { TextArea } = Input;

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

const CreatePost = ({ open, setOpen }: any) => {
  const [loading, setLoading] = useState(false);
  const [tag, setTag] = useState(['']);
  const [mode, setMode] = useState<postMode>(postMode.PUBLIC);
  const [content, setContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [albums, setAlbums] = useState(albumSelectionInit);
  const [selectedAlbum, setSelectedAlbum] = useState(albumSelectionInit[0].value);
  const [isOpenNewAlbum, setIsOpenNewAlbum] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentUser = useSelector((state: RootState) => state.user.user);

  const [messageApi, contextHolder] = message.useMessage();

  const handleChangeContent = (event: any) => {
    const content = event.target.value;
    const pattern = /#[^\s!@#$%^&*()=+.\/,\[{\]};:'"?><]+/g;
    const found = content.match(pattern);
    const filterTag: string[] = found?.map((tag: string) => tag.substring(1));
    setTag(filterTag);
    setContent(content);
  };
  const handleChangePostMode = (value: string) => {
    setMode(value as postMode);
  };

  const handleChangeAlbum = (value: string) => {
    if (value === albumSelectionInit[1].value) {
      setIsOpenNewAlbum(true);
    } else {
      setSelectedAlbum(value);
    }
  };

  const notify = (type: any, message: string) => {
    messageApi.open({
      type: type,
      content: message,
    });
  };

  const handleSubmit = async (event: any) => {
    try {
      if (selectedFiles.length == 0) {
        notify('error', 'Không thể thiếu hình ảnh hoặc video');
        return;
      }
      setLoading(true);
      const formData: any = new FormData();

      const dto_object = new Blob(
        [
          JSON.stringify({
            userId: '',
            postType: 'POST',
            postMode: mode,
            caption: content,
            tagList: tag,
          }),
        ],
        {
          type: 'application/json',
        }
      );
      formData.append('postRequest', dto_object, '');

      selectedFiles.forEach((file) => {
        formData.append('files', file);
      });

      if (selectedAlbum !== albumSelectionInit[0].value) {
        const albumObject = new Blob(
          [
            JSON.stringify({
              id: selectedAlbum,
            }),
          ],
          {
            type: 'application/json',
          }
        );
        formData.append('albumShortRequest', albumObject, '');
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.API}/api/v1/post`, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
        },
        body: formData,
      });
      const data = await response.json();

      if (data.error === true) {
        setLoading(false);
        setOpen(false);
        notify('error', data.message);
      } else {
        handleCancel();
        setLoading(false);
        notify('success', 'Đăng bài thành công');
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setContent('');
    setSelectedFiles([]);
    setTag([]);
    setMode(postMode.PUBLIC);
    setOpen(false);
    setSelectedAlbum(albumSelectionInit[0].value);
  };

  const postModeOption = [
    {
      value: postMode.PUBLIC,
      label: (
        <span>
          <FontAwesomeIcon
            icon={faEarthAmericas as IconProp}
            size='sm'
            style={{ color: 'darkgrey' }}
          />{' '}
          Công Khai{' '}
        </span>
      ),
    },
    {
      value: postMode.FRIEND,
      label: (
        <span>
          <FontAwesomeIcon icon={faUserGroup as IconProp} size='sm' style={{ color: 'darkgrey' }} />{' '}
          Bạn bè
        </span>
      ),
    },
    {
      value: postMode.PRIVATE,
      label: (
        <span>
          <FontAwesomeIcon icon={faLock as IconProp} size='sm' style={{ color: 'darkgrey' }} />{' '}
          Riêng Tư
        </span>
      ),
    },
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const files = Array.from(event.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear input value
    }
  };

  // load album list to Select dropdown
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

  // remove file from selected list
  const removeFile = (index: number) => {
    setSelectedFiles((prev) => {
      const newArray = prev.filter((item, i) => {
        return index !== i;
      });
      return newArray;
    });
  };

  useEffect(() => {
    loadAlbumSelection();
  }, []);

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        title={<div className='w-full flex justify-center font-bold text-lg'>Tạo bài viết mới</div>}
        onOk={handleSubmit}
        onCancel={handleCancel}
        className='min-w-min'
        footer={[
          <Button key='back' onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key='submit' type='primary' loading={loading} onClick={handleSubmit}>
            Đăng
          </Button>,
        ]}
        centered
      >
        <div className='flex flex-wrap gap-3 w-1000 h-70vh'>
          <div className='flex-1 flex flex-col gap-1 overflow-hidden noselect '>
            <div className='flex-1'>
              {selectedFiles.length > 0 ? (
                <MediaSlider
                  files={selectedFiles}
                  index={currentIndex}
                  setIndex={setCurrentIndex}
                />
              ) : (
                <label
                  htmlFor='inputFile'
                  className='flex flex-col justify-center items-center h-full text-xl rounded-lg
                     border-2 border-dashed border-blue-300 text-blue-300 hover:border-blue-600
                      hover:text-blue-600 cursor-pointer'
                >
                  <FontAwesomeIcon icon={faArrowUpFromBracket} />
                  Thêm ảnh hoặc video
                </label>
              )}
            </div>
            <input
              id='inputFile'
              ref={fileInputRef}
              type='file'
              accept='image/png, image/jpeg, image/gif, video/mp4'
              multiple
              onChange={handleFileChange}
              className='absolute w-0 h-0 opacity-0 '
            />
            {selectedFiles.length > 0 && (
              <div className='flex gap-1 h-20 no-scrollbar overflow-x-scroll relative '>
                <label
                  htmlFor='inputFile'
                  className='flex justify-center align-middle h-full rounded-lg border-2 
                  border-dashed border-blue-300 text-blue-300 hover:border-blue-600 
                  hover:text-blue-600 cursor-pointer'
                  style={{ aspectRatio: 1 }}
                >
                  <PlusOutlined />
                </label>
                {selectedFiles.map((file, index) => {
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        setCurrentIndex(index);
                      }}
                      className='h-full group relative'
                      style={{ aspectRatio: 1 }}
                    >
                      <div
                        className={`overflow-hidden opacity-60  rounded-lg border-2 border-opacity-0 border-blue-700 w-full h-full ${
                          currentIndex === index && 'border-opacity-100 opacity-100'
                        }`}
                      >
                        {file.type.startsWith('image') ? (
                          <img
                            className='object-cover w-full h-full overflow-hidden'
                            src={URL.createObjectURL(file)}
                            alt=''
                          />
                        ) : (
                          <video src={URL.createObjectURL(file)} />
                        )}
                      </div>
                      <div className='absolute top-0 left-0 w-full h-full rounded-lg overflow-hidden opacity-0 group-hover:opacity-100'>
                        <div className='bg-black w-full h-full opacity-50' />
                        <div className='absolute top-1 right-1'>
                          <FontAwesomeIcon
                            icon={faTrashCan}
                            size='lg'
                            className='text-white cursor-pointer opacity-70 hover:opacity-100'
                            onClick={() => {
                              removeFile(index);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className='flex-1 flex flex-col gap-4'>
            <div className='flex flex-row items-center'>
              <a
                className='user-img h-10 w-10 border rounded-full overflow-hidden mr-4'
                href={`/profile/${currentUser?.username}`}
              >
                <img alt='avatar' draggable='false' src={currentUser?.avatar} />
              </a>
              <a
                className='user-name-and-place flex flex-col no-underline text-gray-900 hover:text-gray-400'
                href={`/profile/${currentUser?.username}`}
              >
                <span className='text-base font-bold'>{currentUser?.username}</span>
              </a>
            </div>
            <Space>
              <span>Chế độ: </span>
              <Select
                defaultValue='PUBLIC'
                value={mode}
                style={{ width: 150 }}
                onChange={handleChangePostMode}
                options={postModeOption}
              />

              <span className='ml-4'>Album: </span>
              <Select
                value={selectedAlbum}
                style={{ width: 150 }}
                onChange={handleChangeAlbum}
                options={albums}
              />
            </Space>

            <div className='flex-1'>
              <TextArea
                style={{ height: '100%', maxHeight: '100%', minHeight: '100%' }}
                value={content}
                placeholder='Bạn đang nghĩ gì?'
                onChange={handleChangeContent}
                autoSize={{ maxRows: 16 }}
              />
            </div>
          </div>
        </div>
      </Modal>

      <AddNewAlbumModal
        open={isOpenNewAlbum}
        setOpen={setIsOpenNewAlbum}
        onAddNewAlbumComplete={onAddNewAlbumComplete}
      />
    </>
  );
};

export default CreatePost;
