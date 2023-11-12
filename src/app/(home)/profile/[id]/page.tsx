"use client";
import { useEffect, useState } from "react";
import { Button, Col, Divider, Row } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

import { useAuth } from "@/context/AuthContext";
import styles from "./page.module.scss";
import ButtonWrapper from "./ButtonWrapper";

enum RelationshipProfile {
  SELF = "SELF",
  STRANGER = "STRANGER",
  PENDING = "PENDING",
  INCOMMINGREQUEST = "INCOMMINGREQUEST",
  FRIEND = "FRIEND",
  BLOCK = "BLOCK",
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
};

type post = {
  postId: string;
  userId: string;
  postType: string;
  postMode: string;
  caption: string;
  tagList: string[];
  files: string[];
};

const Profile = ({ params }: { params: { id: string } }) => {
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
  });

  const [posts, setPosts] = useState<post[]>([]);

  const setData = (user: user, posts: post[]) => {
    setUser(user);
    setPosts(posts);
  };

  const { currentUser } = useAuth();

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const fetchUserProfile = async () => {
        const response = await fetch(
          `${process.env.API}/api/v1/profile?id=${params.id}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        if (response.status === 200) {
          const data = await response.json();
          return data.data;
        } else if (response.status === 401) {
          console.log("JWT expired");
        }
      };

      const fetchPost = async (userId: string) => {
        const response = await fetch(
          `${process.env.API}/api/v1/${userId}/posts`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        if (response.status === 200) {
          const data = await response.json();
          return data.data;
        } else if (response.status === 401) {
          console.log("JWT expired");
        }
      };

      const user: user = await fetchUserProfile();
      const posts: post[] = await fetchPost(user.id);

      setData(user, posts);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const goToMessage = () => {
    alert("Tính năng này chưa có");
  };

  const cancelRequest = async (
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const token = localStorage.getItem("token");

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.API}/api/v1/relationship/friend-request`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: currentUser.id,
            userRelatedId: user.id,
          }),
        }
      );

      if (response.status >= 200 && response.status < 300) {
        //succcess
        setLoading(false);
        fetchData();
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const acceptFriendRequest = async (
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const token = localStorage.getItem("token");

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.API}/api/v1/relationship/received-friend-requests`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: currentUser.id,
            userRelatedId: user.id,
          }),
        }
      );

      const data = await response.json();

      if (!data.error) {
        //success
        setLoading(false);
        fetchData();
      }
    } catch (err) {
      setLoading(false);
    }
  };
  const denyFriendRequest = async (
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const token = localStorage.getItem("token");

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.API}/api/v1/relationship/received-friend-requests`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: currentUser.id,
            userRelatedId: user.id,
          }),
        }
      );

      if (response.status >= 200 && response.status < 300) {
        //succcess
        setLoading(false);
        fetchData();
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const deleteFriend = async (
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const token = localStorage.getItem("token");

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.API}/api/v1/relationship/friends`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: currentUser.id,
            userRelatedId: user.id,
          }),
        }
      );

      if (response.status >= 200 && response.status < 300) {
        //succcess
        setLoading(false);
        fetchData();
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const addFriend = async (
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const token = localStorage.getItem("token");

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.API}/api/v1/relationship/friend-request`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: currentUser.id,
            userRelatedId: user.id,
          }),
        }
      );

      const data = await response.json();

      if (!data.error) {
        //success
        setLoading(false);
        fetchData();
      }
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div>
      <Row style={{ background: "white" }}>
        <Col
          xs={{ span: 24 }}
          md={{ span: 20, offset: 2 }}
          lg={{ span: 16, offset: 4 }}
        >
          <Row>
            <Col xs={24}>
              <img
                style={{
                  width: "100%",
                  height: "300px",
                  borderRadius: "5px",
                  objectFit: "cover",
                }}
                src={`${user.bio}`}
                alt="background"
              />
            </Col>
          </Row>

          <Row style={{ marginBottom: "40px" }}>
            <Col xs={7}>
              <img
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  position: "absolute",
                  top: "-50px",
                  marginLeft: "50px",
                  border: "5px solid white",
                  borderRadius: "50%",
                }}
                src={`${user.avatar}`}
                alt="avatar"
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
                    <Link
                      href="edit"
                      className={`${styles.button} ${styles["btn-link"]}`}
                    >
                      Chỉnh sửa trang cá nhân
                    </Link>
                    <div className={styles.clickable}>
                      <FontAwesomeIcon
                        icon={faGear}
                        style={{ fontSize: "30px" }}
                      />
                    </div>
                  </div>
                ) : user.relationship == RelationshipProfile.PENDING ? (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <ButtonWrapper onClick={goToMessage} primary>
                      Nhắn tin
                    </ButtonWrapper>
                    <ButtonWrapper
                      onClick={cancelRequest}
                      style={{ background: "#efefef" }}
                    >
                      Hủy yêu cầu
                    </ButtonWrapper>
                  </div>
                ) : user.relationship ==
                  RelationshipProfile.INCOMMINGREQUEST ? (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <ButtonWrapper onClick={acceptFriendRequest} primary>
                      Chấp nhận
                    </ButtonWrapper>
                    <ButtonWrapper onClick={denyFriendRequest} primary danger>
                      Từ chối
                    </ButtonWrapper>

                    <ButtonWrapper
                      onClick={goToMessage}
                      style={{ background: "#d8dadf" }}
                    >
                      Nhắn tin
                    </ButtonWrapper>
                  </div>
                ) : user.relationship == RelationshipProfile.FRIEND ? (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <ButtonWrapper onClick={goToMessage} primary>
                      Nhắn tin
                    </ButtonWrapper>
                    <ButtonWrapper onClick={deleteFriend} primary danger>
                      Xóa
                    </ButtonWrapper>
                  </div>
                ) : user.relationship == RelationshipProfile.STRANGER ? (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <ButtonWrapper onClick={addFriend} primary>
                      Thêm bạn bè
                    </ButtonWrapper>
                    <ButtonWrapper
                      onClick={goToMessage}
                      style={{ background: "#efefef" }}
                    >
                      Nhắn tin
                    </ButtonWrapper>
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <div style={{ display: "flex", gap: "20px" }}>
                <span>{`${user.fullName}`}</span>
                <span>{`${user.postCount} bài viết`}</span>
                <div
                  className={styles.button}
                >{`${user.friendCount} bạn bè`}</div>
              </div>
            </Col>
          </Row>
          <Divider
            style={{ borderTop: "1px solid #dbdbdb", marginBottom: "-0.5px" }}
          />
          <Row style={{ display: "flex", justifyContent: "center" }}>
            <div className={`${styles.tag} ${styles.active} ${styles.button}`}>
              Bài viết
            </div>
            {user.relationship == RelationshipProfile.SELF ? (
              <>
                <div className={`${styles.tag} ${styles.button}`}>Đã lưu</div>
                <div className={`${styles.tag} ${styles.button}`}>Đã thích</div>
              </>
            ) : (
              ""
            )}
          </Row>
          <Row gutter={[3, 3]}>
            {posts.map((post, id) => (
              <Col xs={8} key={id}>
                <img
                  src={`${post.files[0]}`}
                  alt="post image"
                  style={{ aspectRatio: "1/1", objectFit: "cover" }}
                />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
