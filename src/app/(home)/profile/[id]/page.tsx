"use client";
import { useEffect, useState } from "react";
import { Button, Col, Divider, Dropdown, Form, Image, Input, MenuProps, Modal, Row, message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faLocationDot, faMars, faVenus } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import dayjs from "dayjs";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";

import styles from "./page.module.scss";
import ButtonWrapper from "./ButtonWrapper";
import Loading from "@/component/Loading";
import ImagePreviewWrapper from "@/component/ImagePreviewWrapper";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  deleteFriend,
  denyFriendRequest,
  getFriend,
  sendFriendRequest,
} from "@/services/friendService";
import PostProfileComponent from "@/component/PostProfileComponent";
import { useRouter } from "next/navigation";
import { post, user } from "@/type/type";
import { Gender, RelationshipProfile } from "@/type/enum";
import LongUserCard from "@/component/LongUserCard";
import { changePassword } from "@/services/authService";

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};

const initChangePasswordForm = {oldPassword: "", newPassword: "", }

const Profile = ({ params }: { params: { id: string } }) => {
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingPost, setLoadingPost] = useState(false);
  const [user, setUser] = useState<user>({
    id: "",
    username: "",
    email: "",
    isLocked: false,
    bio: "",
    avatar: "",
    fullName: "",
    friendCount: 0,
    postCount: 0,
    relationship: RelationshipProfile.STRANGER,
    gender: Gender.EMPTY,
    address: "",
    dateOfBirth: "",
  });
  const [posts, setPosts] = useState<post[]>([]);
  const [friends, setFriends] = useState<user[]>([])
  const [isOpenModalFriendList, setIsOpenModalFriendList] = useState(false)
  const [isOpenModalChangePassword, setIsOpenModalChangePassword] = useState(false)
  const [inputs, setInputs] = useState(initChangePasswordForm);

  const router = useRouter();

  const [form] = Form.useForm();

  const handleChangeInputChangePasswordForm = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;

    setInputs((values) => ({ ...values, [name]: value }));
  };

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const fetchUserProfile = async () => {
        setLoadingPage(true);
        const response = await fetch(`${process.env.API}/api/v1/profile?id=${params.id}`, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        if (response.status === 200) {
          const data = await response.json();
          setUser(data.data);
          setLoadingPage(false);
          return data.data;
        } else if (response.status === 401) {
          console.log("JWT expired");
        }
      };

      const fetchPost = async (userId: string) => {
        setLoadingPost(true);
        const response = await fetch(`${process.env.API}/api/v1/${userId}/posts`, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        if (response.status === 200) {
          const data = await response.json();
          setLoadingPost(false);
          setPosts(data.data);
        } else if (response.status === 401) {
          console.log("JWT expired");
        }
      };
      const user: user = await fetchUserProfile();
      await fetchPost(user.id);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const goToMessage = () => {
    alert("Tính năng này chưa có");
  };

  const handleCancelFriendRequest = async (
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    try {
      setLoading(true);
      const response = await cancelFriendRequest(user.id);

      if (response.status >= 200 && response.status < 300) {
        //succcess
        await fetchData();
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const handleAcceptFriendRequest = async (
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    try {
      setLoading(true);
      const response = await acceptFriendRequest(user.id);

      const data = await response.json();

      if (!data.error) {
        //success
        await fetchData();
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
    }
  };
  const handleDenyFriendRequest = async (
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    try {
      setLoading(true);
      const response = await denyFriendRequest(user.id);

      if (response.status >= 200 && response.status < 300) {
        //succcess
        await fetchData();
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const handleDeleteFriend = async (setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
    try {
      setLoading(true);
      const response = await deleteFriend(user.id);

      if (response.status >= 200 && response.status < 300) {
        //succcess
        await fetchData();
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const handleSendFriendRequest = async (
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    try {
      setLoading(true);
      const response = await sendFriendRequest(user.id);

      const data = await response.json();

      if (!data.error) {
        //success
        await fetchData();
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const fetchFriendList = async () => {
    try{
      const response = await getFriend(user.id);
      if (response.status === 200) {
        const data = await response.json();
        setFriends(data.data);
      }
    }
    catch(e){
    }

  }

  const handleOpenFriendList = () => {
    fetchFriendList();
    setIsOpenModalFriendList(true)
  }

  const handleCancel = () => {
    setIsOpenModalFriendList(false)
  }
  
  const handleCancelModalChangePassword = () => {
    form.resetFields();
    setInputs(initChangePasswordForm)
    setIsOpenModalChangePassword(false)
  }

  if (loadingPage) {
    return <Loading height="100vh" />;
  }

  const handleOpenChangePasswordModal = () => {
    setIsOpenModalChangePassword(true);
  }

  const handleLogout = () => {
    router.push("/login")
  }

  const itemsDropdown: MenuProps["items"] = [
    {
      label: <a style={{fontSize:"16px"}} onClick={handleOpenChangePasswordModal}>Đổi mật khẩu</a>,
      key: "0",
    },
    {
      label: <a style={{fontSize:"16px"}} onClick={handleLogout}>Đăng xuất</a>,
      key: "1",
    },
  ];

  const handleChangePassword = async () => {
    try {
      const response = await changePassword(inputs);
      if (response.status >= 200 && response.status < 300) {
        message.success("Đổi mật khẩu thành công");
        handleCancelModalChangePassword();
      } else {
        const payload = await response.json();
        message.error(payload.message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <div>
        <Row style={{ background: "white" }}>
          <Col xs={{ span: 24 }} md={{ span: 20, offset: 2 }} lg={{ span: 16, offset: 4 }}>
            <Row>
              <Col xs={24}>
                <ImagePreviewWrapper
                  wrapperStyle={{
                    borderRadius: "5px",
                    overflow: "hidden",
                    height: "300px",
                  }}
                  imageStyle={{
                    objectFit: "cover",
                    background: "white",
                    height: "300px",
                  }}
                  src={`${user.bio ? user.bio : "/default-background.png"}`}
                />
              </Col>
            </Row>

            <Row style={{ marginBottom: "40px" }}>
              <Col xs={7}>
                <ImagePreviewWrapper
                  wrapperStyle={{
                    position: "absolute",
                    top: "-50px",
                    marginLeft: "50px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "2px solid white",
                    height: "150px",
                    width: "150px",
                  }}
                  imageStyle={{
                    objectFit: "cover",
                    background: "white",
                    height: "150px",
                    width: "150px",
                  }}
                  src={`${user.avatar ? user.avatar : "/default-avatar.jpg"}`}
                />
              </Col>
              <Col xs={{ span: 17 }} style={{ fontSize: "18px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ fontSize: "30px" }}>{`${user.username}`}</div>
                  {user.relationship == RelationshipProfile.SELF ? (
                    <div style={{ display: "flex", gap: "20px" }}>
                      <Link href="edit" className={`${styles.button} ${styles["btn-link"]}`}>
                        Chỉnh sửa trang cá nhân
                      </Link>
                      <Dropdown
                        menu={{ items: itemsDropdown }}
                        trigger={["click"]}
                        placement="bottomRight"
                      >
                        <div className={styles.clickable}>
                          <FontAwesomeIcon
                            icon={faGear}
                            style={{ fontSize: "30px", color: "#444" }}
                          />
                        </div>
                      </Dropdown>
                    </div>
                  ) : user.relationship == RelationshipProfile.PENDING ? (
                    <div style={{ display: "flex", gap: "10px" }}>
                      <ButtonWrapper onClick={handleCancelFriendRequest} primary danger>
                        Hủy yêu cầu
                      </ButtonWrapper>
                      <ButtonWrapper onClick={goToMessage} style={{ background: "#d8dadf" }}>
                        Nhắn tin
                      </ButtonWrapper>
                    </div>
                  ) : user.relationship == RelationshipProfile.INCOMMINGREQUEST ? (
                    <div style={{ display: "flex", gap: "10px" }}>
                      <ButtonWrapper onClick={handleAcceptFriendRequest} primary>
                        Chấp nhận
                      </ButtonWrapper>
                      <ButtonWrapper onClick={handleDenyFriendRequest} primary danger>
                        Từ chối
                      </ButtonWrapper>

                      <ButtonWrapper onClick={goToMessage} style={{ background: "#d8dadf" }}>
                        Nhắn tin
                      </ButtonWrapper>
                    </div>
                  ) : user.relationship == RelationshipProfile.FRIEND ? (
                    <div style={{ display: "flex", gap: "10px" }}>
                      <ButtonWrapper onClick={handleDeleteFriend} primary danger>
                        Xóa
                      </ButtonWrapper>
                      <ButtonWrapper onClick={goToMessage} style={{ background: "#d8dadf" }}>
                        Nhắn tin
                      </ButtonWrapper>
                    </div>
                  ) : user.relationship == RelationshipProfile.STRANGER ? (
                    <div style={{ display: "flex", gap: "10px" }}>
                      <ButtonWrapper onClick={handleSendFriendRequest} primary>
                        Thêm bạn bè
                      </ButtonWrapper>
                      <ButtonWrapper onClick={goToMessage} style={{ background: "#d8dadf" }}>
                        Nhắn tin
                      </ButtonWrapper>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    margin: "10px 0",
                  }}
                >
                  <span>{`${user.fullName}`}</span>
                  <div style={{ display: "flex", gap: "20px" }}>
                    <span>{`${user.postCount} bài viết`}</span>
                    <div
                      onClick={handleOpenFriendList}
                      className={styles.button}
                    >{`${user.friendCount} bạn bè`}</div>
                  </div>
                </div>

                {user.gender || user.address || user.dateOfBirth ? (
                  <div>
                    <span style={{ fontWeight: 600 }}>{`Giới thiệu`}</span>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {user.gender ? (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          {user.gender == Gender.MALE ? (
                            <FontAwesomeIcon icon={faMars} color="blue" style={{ width: "20px" }} />
                          ) : user.gender == Gender.FEMALE ? (
                            <FontAwesomeIcon icon={faVenus} color="red" style={{ width: "20px" }} />
                          ) : (
                            ""
                          )}

                          <div style={{ width: "120px" }}>Giới tính:</div>
                          <div>
                            {user.gender == Gender.MALE
                              ? "Nam"
                              : user.gender == Gender.FEMALE
                              ? "Nữ"
                              : ""}
                          </div>
                        </div>
                      ) : (
                        ""
                      )}

                      {user.address ? (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <FontAwesomeIcon
                            icon={faLocationDot}
                            color="#2666c0"
                            style={{ width: "20px" }}
                          />
                          <div style={{ width: "120px" }}>Sống tại:</div>
                          <div>{user.address}</div>
                        </div>
                      ) : (
                        ""
                      )}

                      {user.dateOfBirth ? (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <FontAwesomeIcon
                            icon={faCalendar}
                            color="#4889f4"
                            style={{ width: "20px" }}
                          />

                          <div style={{ width: "120px" }}>Ngày sinh:</div>
                          <div>{dayjs(user.dateOfBirth, "YYYY-MM-DD").format("DD/MM/YYYY")}</div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </Col>
            </Row>
            <Divider style={{ borderTop: "1px solid #dbdbdb", marginBottom: "-0.5px" }} />
            <Row style={{ display: "flex", justifyContent: "center" }}>
              <div className={`${styles.tag} ${styles.active} ${styles.button}`}>Bài viết</div>
              {/* <div className={`${styles.tag} ${styles.button}`} style={{cursor:"not-allowed"}}>Reels</div> */}
              {/* {user.relationship == RelationshipProfile.SELF ? (
              <>
                <div className={`${styles.tag} ${styles.button}`}>Đã lưu</div>
                <div className={`${styles.tag} ${styles.button}`}>Đã thích</div>
              </>
            ) : (
              ""
            )} */}
            </Row>
            {loadingPost ? (
              <Loading height="50px" />
            ) : (
              <Row gutter={[3, 3]}>
                {posts.map((post, id) => (
                  <Col xs={8} key={id}>
                    <PostProfileComponent
                      src={`${post.files[0]}`}
                      onClick={() => {
                        router.push(`/post/${post.postId}`, { scroll: false });
                      }}
                      likeNumber={post.reactions.length}
                      commentNumber={0}
                    />
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        </Row>
      </div>
      <Modal
        forceRender
        title="Danh sách bạn bè"
        open={isOpenModalFriendList}
        onCancel={handleCancel}
        footer={null}
      >
        <div style={{ minHeight: "300px", maxHeight: "370px", overflow: "auto" }}>
          {friends.length <= 0 ? (
            <div>Không có bạn bè nào để hiển thị</div>
          ) : (
            friends.map((user, index) => <LongUserCard key={index} user={user} />)
          )}
        </div>
      </Modal>

      <Modal
        forceRender
        title="Đổi mật khẩu"
        open={isOpenModalChangePassword}
        onCancel={handleCancelModalChangePassword}
        footer={null}
      >
        <div>
          <Form
            onFinish={handleChangePassword}
            form={form}
            autoComplete="off"
            {...formItemLayout}
            scrollToFirstError
          >
            <Form.Item
              name="oldPassword"
              label="Mật khẩu hiện tại"
              rules={[
                {
                  required: true,
                  message: "Hãy nhập mật khẩu hiện tại!",
                },
              ]}
              hasFeedback
            >
              <Input.Password
                name="oldPassword"
                value={inputs.oldPassword}
                onChange={handleChangeInputChangePasswordForm}
              />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="Mật khẩu mới"
              rules={[
                {
                  required: true,
                  message: "Hãy nhập mật khẩu mới!",
                },
              ]}
              hasFeedback
            >
              <Input.Password
                name="newPassword"
                value={inputs.newPassword}
                onChange={handleChangeInputChangePasswordForm}
              />
            </Form.Item>

            <Form.Item
              name="confirm"
              label="Nhập lại mật khẩu"
              dependencies={["newPassword"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Xác nhận lại mật khẩu!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Nhập lại mật khẩu không chính xác!"));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            <div style={{display:"flex", justifyContent:"end"}}>
              <Button size="large" type="primary" htmlType="submit">
                 Xác nhận
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default Profile;
