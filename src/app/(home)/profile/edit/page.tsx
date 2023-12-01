"use client";

import React, { useState, useEffect } from "react";
import { Button, Col, DatePicker, Form, Input, Row, Select, message } from "antd";
import dayjs from "dayjs";

import { useAuth } from "@/context/AuthContext";
import ImagePreviewWrapper from "@/component/ImagePreviewWrapper";
import { updateAvatar, updateBackground, updateProfileInfo } from "@/services/profileService";
import { profile } from "@/type/type";
import { Gender } from "@/type/enum";

const formItemLayout = {
  labelCol: {
    xs: {
      span: 20,
    },
    sm: {
      span: 4,
    },
  },
  wrapperCol: {
    xs: {
      span: 20,
    },
    sm: {
      span: 12,
    },
  },
};

const EditProfile = () => {
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [backgroundLoading, setBackgroundLoading] = useState(false);
  const [inputs, setInputs] = useState<profile>({
    fullName: null,
    gender: null,
    // address: null,
    dateOfBirth: null,
  });

  const { currentUser, setCurrentUser } = useAuth();

  const [messageApi, contextHolder] = message.useMessage();

  const notify = (type: any, message: string) => {
    messageApi.open({
      type: type,
      content: message,
    });
  };

  // handle set value for multiple input
  const handleChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;

    setInputs((values) => ({ ...values, [name]: value }));
  };

  // use effect: set data
  useEffect(() => {
    const fullName = currentUser.profile.fullName;
    const gender = currentUser.profile.gender || "";
    const dateOfBirth = currentUser.profile.dateOfBirth
      ? dayjs(currentUser.profile.dateOfBirth, "YYYY-MM-DD")
      : undefined;

    setInputs((values) => ({
      ...values,
      fullName,
      gender: currentUser.profile.gender,
      dateOfBirth: currentUser.profile.dateOfBirth,
    }));
    form.setFieldsValue({
      fullName,
      gender,
      dateOfBirth,
    });
  }, [currentUser]);

  const [form] = Form.useForm();
  const handleUpdateProfileInfo = async (event: any) => {
    try {
      setLoading(true);
      const response = await updateProfileInfo(inputs);

      const data = await response.json();

      if (data.error) {
        // fail
        setLoading(false);
        notify("error", data.message);
      } else {
        //  success
        setLoading(false);
        notify("success", "Cập nhật thành công");
        setCurrentUser({
          ...currentUser,
          profile: { ...currentUser.profile, ...data.data },
        });
      }
    } catch (err) {
      console.log(err);
      notify("error", JSON.stringify(err));
      setLoading(false);
    }
  };

  const selectAndUpdateAvatar = () => {
    var input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        const file = files[0];
        // if(file.type !== "image/png")
        var formData = new FormData();
        formData.append("file", file);

        try {
          setAvatarLoading(true);
          const response = await updateAvatar(formData);

          const data = await response.json();

          if (data.error) {
            // fail
            setAvatarLoading(false);
            notify("error", data.message);
          } else {
            //  success
            setAvatarLoading(false);
            notify("success", "Cập nhật thành công");
            setCurrentUser({
              ...currentUser,
              profile: { ...currentUser.profile, ...data.data },
            });
          }
        } catch (err) {
          console.log(err);
          notify("error", JSON.stringify(err));
          setAvatarLoading(false);
        }
      }
    };

    input.click();
  };

  const selectAndUpdateBackground = () => {
    var input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        const file = files[0];
        // if(file.type !== "image/png")
        var formData = new FormData();
        formData.append("file", file);

        try {
          setBackgroundLoading(true);
          const response = await updateBackground(formData);

          const data = await response.json();

          if (data.error) {
            // fail
            setBackgroundLoading(false);
            notify("error", data.message);
          } else {
            //  success
            setBackgroundLoading(false);
            notify("success", "Cập nhật thành công");
            setCurrentUser({
              ...currentUser,
              profile: { ...currentUser.profile, ...data.data },
            });
          }
        } catch (err) {
          console.log(err);
          notify("error", JSON.stringify(err));
          setBackgroundLoading(false);
        }
      }
    };

    input.click();
  };

  return (
    <>
      {contextHolder}
      <div
        style={{
          padding: "50px 70px",
          background: "white",
        }}
      >
        <div>
          <Row>
            <Col xs={{ span: 20, offset: 4 }}>
              <h1
                style={{
                  fontSize: "22px",
                  marginBottom: "50px",
                  fontWeight: 600,
                }}
              >
                Chỉnh sửa trang cá nhân
              </h1>
            </Col>
          </Row>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <Row>
            <Col xs={{ span: 20, offset: 4 }}>
              <div style={{ fontWeight: "600", height: "32px", fontSize: "16px" }}>
                Ảnh đại diện
              </div>
            </Col>
            <Col xs={{ span: 12, offset: 4 }}>
              <div>
                <ImagePreviewWrapper
                  wrapperStyle={{ width: "100%" }}
                  imageStyle={{ background: "white", width: "100%", height: "auto" }}
                  src={`${
                    currentUser.profile.avatar ? currentUser.profile.avatar : "/default-avatar.jpg"
                  }`}
                />

                <Button
                  style={{
                    marginTop: "12px",
                    backgroundColor: "#fafafa",
                    color: `${avatarLoading ? "#ccc" : "#4096ff"}`,
                    borderColor: `${avatarLoading ? "#ccc" : "#4096ff"}`,
                  }}
                  onClick={selectAndUpdateAvatar}
                  disabled={avatarLoading}
                >
                  {avatarLoading ? "Please wait..." : "Thay đổi ảnh đại diện"}
                </Button>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={{ span: 20, offset: 4 }}>
              <div style={{ fontWeight: "600", height: "32px", fontSize: "16px" }}>Ảnh bìa</div>
            </Col>
            <Col xs={{ span: 12, offset: 4 }}>
              <div>
                <ImagePreviewWrapper
                  wrapperStyle={{
                    width: "100%",
                  }}
                  imageStyle={{ background: "white", width: "100%", height: "auto" }}
                  src={`${
                    currentUser.profile.bio ? currentUser.profile.bio : "/default-background.png"
                  }`}
                />
                <Button
                  style={{
                    marginTop: "12px",
                    backgroundColor: "#fafafa",
                    color: `${backgroundLoading ? "#ccc" : "#4096ff"}`,
                    borderColor: `${backgroundLoading ? "#ccc" : "#4096ff"}`,
                  }}
                  onClick={selectAndUpdateBackground}
                  disabled={backgroundLoading}
                >
                  {backgroundLoading ? "Please wait..." : "Thay đổi ảnh bìa"}
                </Button>
              </div>
            </Col>
          </Row>
          <div>
            <Form
              onFinish={handleUpdateProfileInfo}
              form={form}
              autoComplete="off"
              {...formItemLayout}
              requiredMark={false}
              colon={false}
              scrollToFirstError
            >
              <Form.Item
                name="fullName"
                label={<label style={{ fontSize: "16px", fontWeight: 600 }}>Họ và tên</label>}
                rules={[
                  {
                    required: true,
                    message: "Please input your name!",
                  },
                ]}
              >
                <Input name="fullName" onChange={handleChange} />
              </Form.Item>

              <Form.Item
                name="gender"
                label={<label style={{ fontSize: "16px", fontWeight: 600 }}>Giới tính</label>}
              >
                <Select
                  style={{
                    width: 120,
                  }}
                  onChange={(value: string) => {
                    setInputs((values) => ({ ...values, ["gender"]: value || null }));
                  }}
                  options={[
                    {
                      value: `${Gender.EMPTY}`,
                      label: "Ẩn",
                    },
                    {
                      value: `${Gender.MALE}`,
                      label: "Nam",
                    },
                    {
                      value: `${Gender.FEMALE}`,
                      label: "Nữ",
                    },
                  ]}
                />
              </Form.Item>

              <Form.Item
                name="dateOfBirth"
                label={<label style={{ fontSize: "16px", fontWeight: 600 }}>Ngày sinh</label>}
              >
                <DatePicker
                  format={"DD/MM/YYYY"}
                  onChange={(date, dateString) => {
                    const formattedDate = date ? date.format("YYYY-MM-DD") : "";
                    setInputs((values) => ({
                      ...values,
                      ["dateOfBirth"]: formattedDate,
                    }));
                  }}
                />
              </Form.Item>
              {/* <Row>
                <Col xs={{ offset: 0 }} sm={{ offset: 4 }}>
                  <Select
                    defaultValue={currentUser.profile.gender}
                    style={{
                      width: 120,
                    }}
                    onChange={handleChangeGender}
                    options={[
                      {
                        value: `${Gender.EMPTY}`,
                        label: "Ẩn",
                      },
                      {
                        value: `${Gender.MALE}`,
                        label: "Nam",
                      },
                      {
                        value: `${Gender.FEMALE}`,
                        label: "nữ",
                      },
                    ]}
                  />
                </Col>
              </Row> */}
              <Row>
                <Col xs={{ offset: 0 }} sm={{ offset: 4 }}>
                  <Button type="primary" htmlType="submit" disabled={loading}>
                    {loading ? "Please wait..." : "Cập nhật"}
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
