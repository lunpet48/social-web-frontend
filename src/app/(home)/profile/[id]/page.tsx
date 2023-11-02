"use client";
import { useEffect, useState } from "react";
import { Col, Divider, Row } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./page.module.scss";
import { faGear } from "@fortawesome/free-solid-svg-icons";

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
  console.log("render");
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
  });

  const [posts, setPosts] = useState<post[]>([]);

  const setData = (user: user, posts: post[]) => {
    setUser(user);
    setPosts(posts);
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const fetchUserProfile = async () => {
          const response = await fetch(`${process.env.API}/api/v1/profile?id=${params.id}`, {
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,
            },
          });
          if (response.status === 200) {
            const data = await response.json();
            // setUser(data.data);
            return data.data;
          } else if (response.status === 401) {
            console.log("JWT expired");
          }
        };

        const fetchPost = async (userId: string) => {
          const response = await fetch(`${process.env.API}/api/v1/${userId}/posts`, {
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,
            },
          });
          if (response.status === 200) {
            const data = await response.json();
            // setPosts(data.data);
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

    fetchData();
  }, []);
  return (
    <div>
      <Row style={{ background: "white" }}>
        <Col xs={{ span: 24 }} md={{ span: 20, offset: 2 }} lg={{ span: 16, offset: 4 }}>
          <Row>
            <Col xs={24}>
              <img
                style={{ width: "100%", height: "300px", borderRadius: "5px", objectFit: "cover" }}
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
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: "30px" }}>{`${user.username}`}</div>
                <div style={{ display: "flex", gap: "20px" }}>
                  <div className={`${styles.button} ${styles["btn-link"]}`}>Chỉnh sửa trang cá nhân</div>
                  <div className={styles.clickable}>
                    <FontAwesomeIcon icon={faGear} style={{ fontSize: "30px" }} />
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "20px" }}>
                <span>{`${user.fullName}`}</span>
                <span>{`${user.postCount} bài viết`}</span>
                <div className={styles.button}>{`${user.friendCount} bạn bè`}</div>
              </div>
            </Col>
          </Row>
          <Divider style={{ borderTop: "1px solid #dbdbdb", marginBottom: "-0.5px" }} />
          <Row style={{ display: "flex", justifyContent: "center" }}>
            <div className={`${styles.tag} ${styles.active} ${styles.button}`}>Bài viết</div>
            <div className={`${styles.tag} ${styles.button}`}>Đã lưu</div>
            <div className={`${styles.tag} ${styles.button}`}>Đã thích</div>
          </Row>
          <Row gutter={[3, 3]}>
            {posts.map((post) => (
              <Col xs={8}>
                <img src={`${post.files[0]}`} alt="post image" style={{ aspectRatio: "1/1", objectFit: "cover" }} />
              </Col>
            ))}
            {/* <Col xs={8}>
              <img
                src="https://huggingface.co/tasks/assets/image-classification/image-classification-input.jpeg"
                alt="post image"
                style={{ aspectRatio: "1/1", objectFit: "cover" }}
              />
            </Col>
            <Col xs={8}>
              <img
                src="https://haycafe.vn/wp-content/uploads/2022/05/Anh-songoku-baby-goku-cute.jpg"
                alt="post image"
                style={{ aspectRatio: "1/1", objectFit: "cover" }}
              />
            </Col>
            <Col xs={8}>
              <img
                src="https://huggingface.co/tasks/assets/image-classification/image-classification-input.jpeg"
                alt="post image"
                style={{ aspectRatio: "1/1", objectFit: "cover" }}
              />
            </Col>
            <Col xs={8}>
              <img
                src="https://huggingface.co/tasks/assets/image-classification/image-classification-input.jpeg"
                alt="post image"
                style={{ aspectRatio: "1/1", objectFit: "cover" }}
              />
            </Col>
            <Col xs={8}>
              <img
                src="https://huggingface.co/tasks/assets/image-classification/image-classification-input.jpeg"
                alt="post image"
                style={{ aspectRatio: "1/1", objectFit: "cover" }}
              />
            </Col> */}
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
