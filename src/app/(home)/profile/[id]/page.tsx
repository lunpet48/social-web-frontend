"use client";
import { useEffect, useState } from "react";
import { Button, Col, Divider, Image, Row } from "antd";
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
  sendFriendRequest,
} from "@/services/friendService";
import PostProfileComponent from "@/component/PostProfileComponent";
import { useRouter } from "next/navigation";

enum RelationshipProfile {
  SELF = "SELF",
  STRANGER = "STRANGER",
  PENDING = "PENDING",
  INCOMMINGREQUEST = "INCOMMINGREQUEST",
  FRIEND = "FRIEND",
  BLOCK = "BLOCK",
}

enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  EMPTY = "",
}

type user = {
  id: string;
  username: string;
  email: string;
  isLocked: false;
  bio: string;
  avatar: string;
  fullName: string;
  friendCount: number;
  postCount: number;
  relationship: RelationshipProfile;
  gender: Gender;
  address: string;
  dateOfBirth: string;
};

type post = {
  postId: string;
  userId: string;
  postType: string;
  postMode: string;
  caption: string;
  tagList: string[];
  files: string[];
  reactions: string[];
};

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

  const setData = (user: user, posts: post[]) => {
    setUser(user);
    setPosts(posts);
    setLoadingPage(false);
  };

  const router = useRouter();

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
          console.log("post", data.data);
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

  if (loadingPage) {
    return <Loading height="100vh" />;
  }

  return (
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
                    {/* <div className={styles.clickable}>
                      <FontAwesomeIcon
                        icon={faGear}
                        style={{ fontSize: "30px" }}
                      />
                    </div> */}
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
                  <div className={styles.button}>{`${user.friendCount} bạn bè`}</div>
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
  );
};

export default Profile;
