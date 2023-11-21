"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  message,
} from "antd";
import dayjs from "dayjs";

import { useAuth } from "@/context/AuthContext";
enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  EMPTY = "",
}

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
  const [inputs, setInputs] = useState({
    fullname: "",
    gender: "",
    address: "",
    dateOfBirth: "",
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
    const fullname = currentUser.profile.fullName;
    setInputs((values) => ({ ...values, fullname }));
    form.setFieldsValue({
      fullname,
    });
  }, [currentUser]);

  const [form] = Form.useForm();
  const handleSubmit = async (event: any) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(`${process.env.API}/api/v1/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          userId: currentUser.id,
          fullName: inputs.fullname,
          gender: inputs.gender ? inputs.gender : null,
          dateOfBirth: inputs.dateOfBirth,
        }),
      });

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
      const token = localStorage.getItem("token");

      const files = (e.target as HTMLInputElement).files;
      if (files) {
        const file = files[0];
        // if(file.type !== "image/png")
        var formdata = new FormData();
        formdata.append("file", file);

        try {
          setAvatarLoading(true);
          const response = await fetch(
            `${process.env.API}/api/v1/profile/avatar/${currentUser.id}`,
            {
              method: "PUT",
              headers: {
                Authorization: "Bearer " + token,
              },
              body: formdata,
            }
          );

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
      const token = localStorage.getItem("token");

      const files = (e.target as HTMLInputElement).files;
      if (files) {
        const file = files[0];
        // if(file.type !== "image/png")
        var formdata = new FormData();
        formdata.append("file", file);

        try {
          setBackgroundLoading(true);
          const response = await fetch(
            `${process.env.API}/api/v1/profile/background/${currentUser.id}`,
            {
              method: "PUT",
              headers: {
                Authorization: "Bearer " + token,
              },
              body: formdata,
            }
          );

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
              <div
                style={{ fontWeight: "600", height: "32px", fontSize: "16px" }}
              >
                Ảnh đại diện
              </div>
            </Col>
            <Col xs={{ span: 12, offset: 4 }}>
              <div>
                <img
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "5px",
                    background: "white",
                  }}
                  src={`${
                    currentUser.profile.avatar
                      ? currentUser.profile.avatar
                      : "/default-avatar.jpg"
                  }`}
                  alt="avatar"
                />

                <Button
                  style={{ marginTop: "12px", backgroundColor: "#fafafa" }}
                  onClick={selectAndUpdateAvatar}
                  disabled={avatarLoading}
                >
                  {avatarLoading ? "Please wait..." : "Chọn ảnh"}
                </Button>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={{ span: 20, offset: 4 }}>
              <div
                style={{ fontWeight: "600", height: "32px", fontSize: "16px" }}
              >
                Ảnh bìa
              </div>
            </Col>
            <Col xs={{ span: 12, offset: 4 }}>
              <div>
                <img
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "5px",
                    background: "white",
                  }}
                  src={`${
                    currentUser.profile.bio
                      ? currentUser.profile.bio
                      : "/default-background.png"
                  }`}
                  alt="background"
                />
                <Button
                  style={{ marginTop: "12px", backgroundColor: "#fafafa" }}
                  onClick={selectAndUpdateBackground}
                  disabled={backgroundLoading}
                >
                  {backgroundLoading ? "Please wait..." : "Chọn ảnh"}
                </Button>
              </div>
            </Col>
          </Row>
          <div>
            <Form
              onFinish={handleSubmit}
              form={form}
              autoComplete="off"
              {...formItemLayout}
              requiredMark={false}
              colon={false}
              scrollToFirstError
            >
              <Form.Item
                name="fullname"
                label={
                  <label style={{ fontSize: "16px", fontWeight: 600 }}>
                    Họ và tên
                  </label>
                }
                rules={[
                  {
                    required: true,
                    message: "Please input your name!",
                  },
                ]}
              >
                <Input
                  name="fullname"
                  value={inputs.fullname}
                  onChange={handleChange}
                />
              </Form.Item>

              <Form.Item
                name="gender"
                label={
                  <label style={{ fontSize: "16px", fontWeight: 600 }}>
                    Giới tính
                  </label>
                }
              >
                <Select
                  defaultValue={currentUser.profile.gender}
                  style={{
                    width: 120,
                  }}
                  onChange={(value: string) => {
                    setInputs((values) => ({ ...values, ["gender"]: value }));
                  }}
                  options={[
                    {
                      value: null,
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
                label={
                  <label style={{ fontSize: "16px", fontWeight: 600 }}>
                    Ngày sinh
                  </label>
                }
              >
                <DatePicker
                  format={"DD/MM/YYYY"}
                  defaultValue={
                    currentUser.profile.dateOfBirth
                      ? dayjs(currentUser.profile.dateOfBirth, "YYYY-MM-DD")
                      : undefined
                  }
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
                    {loading ? "Please wait..." : "Submit"}
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
