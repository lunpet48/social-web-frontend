import React, { useState, useEffect } from 'react';
import './index.css';
import { Button, Modal, Input, UploadFile, Select, Space, message } from 'antd';
import MediaUpload from './media-upload';
import { faEarthAmericas, faL, faLock, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const { TextArea } = Input;

const CreatePost = ({ open, setOpen }: any) => {
  const [loading, setLoading] = useState(false);
  //   const [open, setOpen] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();
  const [tag, setTag] = useState(['']);
  const [mode, setMode] = useState('PUBLIC');
  const [content, setContent] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleChange = (event: any) => {
    const content = event.target.value;
    const pattern = /#[^\s!@#$%^&*()=+.\/,\[{\]};:'"?><]+/g;
    const found = content.match(pattern);
    const filterTag: string[] = found?.map((tag: string) => tag.substring(1));
    setTag(filterTag);
    setContent(content);
    //setContent(content.replace(pattern, '<span className="hashtag" style={{color: "#ff0000"}}>#$1</span>'))
  };
  const handlePostMode = (value: string) => {
    setMode(value);
  };

  const notify = (type: any, message: string) => {
    messageApi.open({
      type: type,
      content: message,
    });
  };

  const handleSubmit = async (event: any) => {
    try {
      if (fileList.length == 0) {
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

      // formData.append('postRequest', JSON.stringify({
      //       userId: "",
      //       postType: "POST",
      //       postMode: mode,
      //       caption: content,
      //       tagList: tag
      //     }));

      for (let i = 0; i < fileList.length; i++) {
        formData.append('files', fileList[i].originFileObj);
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

      // console.log(data);

      if (data.error === true) {
        // fail
        setLoading(false);
        setOpen(false);
        notify('error', data.message);
      } else {
        //  success
        setLoading(false);
        setOpen(false);
        notify('success', 'Đăng bài thành công');
        setContent('');
        setFileList([]);
        setTag([]);
      }
      // axios.post(
      //   `${process.env.API}/api/v1/post`,
      //   formData,
      //   {
      //     headers: {
      //     "Content-Type": "multipart/form-data; ",
      //     Authorization: "Bearer " + token,
      //     "Accept" : "*/*"
      //     }
      //   }
      // ).then(res => {
      //   setLoading(false);
      //   notify("success", "Đăng bài thành công");
      // })
      // .catch(err => {
      //   setLoading(false);
      //   notify("error", err.message);
      // })
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  // const handleOk = () => {
  //   setLoading(true);
  //   setTimeout(() => {
  //     setLoading(false);
  //     setOpen(false);
  //   }, 3000);
  // };

  const handleCancel = () => {
    setOpen(false);
    setContent('');
    setFileList([]);
    setTag([]);
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        title='Bài viết'
        onOk={handleSubmit}
        onCancel={handleCancel}
        width='1000px'
        footer={[
          <Button key='back' onClick={handleCancel}>
            Return
          </Button>,
          <Button key='submit' type='primary' loading={loading} onClick={handleSubmit}>
            Submit
          </Button>,
        ]}
      >
        <Space style={{ paddingBottom: '10px' }}>
          <span>Chế độ: </span>
          <Select
            defaultValue='PUBLIC'
            style={{ width: 150 }}
            onChange={handlePostMode}
            options={[
              {
                value: 'PUBLIC',
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
                value: 'FRIEND',
                label: (
                  <span>
                    <FontAwesomeIcon
                      icon={faUserGroup as IconProp}
                      size='sm'
                      style={{ color: 'darkgrey' }}
                    />{' '}
                    Bạn bè
                  </span>
                ),
              },
              {
                value: 'PRIVATE',
                label: (
                  <span>
                    <FontAwesomeIcon
                      icon={faLock as IconProp}
                      size='sm'
                      style={{ color: 'darkgrey' }}
                    />{' '}
                    Riêng Tư
                  </span>
                ),
              },
            ]}
          />
        </Space>
        <TextArea
          placeholder='Bạn đang nghĩ gì?'
          autoSize={{ minRows: 3, maxRows: 20 }}
          onChange={handleChange}
        />
        <div style={{ margin: '24px 0' }} />
        <MediaUpload fileList={fileList} setFileList={setFileList}></MediaUpload>
      </Modal>
    </>
  );
};

export default CreatePost;
