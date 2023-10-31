import React, { useState } from "react";
import "./index.css";
import { Button, Modal, Input } from "antd";
import MediaUpload from "./media-upload";

const { TextArea } = Input;

const CreatePost = ({open, setOpen}: any) => {
  const [loading, setLoading] = useState(false);
//   const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <Modal
        open={open}
        title="Bài viết"
        onOk={handleOk}
        onCancel={handleCancel}
        width="1000px"
        footer={[
          <Button key="back" onClick={handleCancel}>
            Return
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleOk}
          >
            Submit
          </Button>,
          <Button
            key="link"
            href="https://google.com"
            type="primary"
            loading={loading}
            onClick={handleOk}
          >
            Search on Google
          </Button>,
        ]}
      >
        <TextArea
          placeholder="Bạn đang nghĩ gì?"
          autoSize={{ minRows: 3, maxRows: 20 }}
        />
        <div style={{ margin: "24px 0" }} />
        <MediaUpload></MediaUpload>
      </Modal>
    </>
  );
};

export default CreatePost;
