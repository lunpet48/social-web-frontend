"use client";
import UserCard from "@/component/UserCard";
import UserCardV2 from "@/component/UserCardV2";
import LikeComponent from "@/component/like-component";
import MediaView from "@/component/media-view";
import { useAuth } from "@/context/AuthContext";
import { Col, Input, Row } from "antd";
import { SearchProps } from "antd/es/input";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const { Search } = Input;

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
  postType: string;
  postMode: string;
  caption: string;
  tagList: string[];
  files: string[];
  reactions: string[];
  createdAt: string;
  user: user;
};

const SearchPage = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<user[]>([]);
  const [posts, setPosts] = useState<post[]>([]);

  const router = useRouter();
  const { currentUser } = useAuth();

  const onSearch: SearchProps["onSearch"] = async (value, _e, info) => {
    if (info?.source == "input" && value.trim() !== "") {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const response = await fetch(`${process.env.API}/api/v1/search?keyword=` + value.trim(), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });

        const data = await response.json();

        if (data.error) {
          // fail
          setLoading(false);
        } else {
          //  success
          setLoading(false);
          setUsers(data.users);
          setPosts(data.posts);
        }
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <Row style={{ background: "white", paddingTop: "30px" }}>
        <Col xs={{ span: 24 }} md={{ span: 16, offset: 4 }} lg={{ span: 12, offset: 6 }}>
          <Row>
            <Search
              placeholder="Tìm kiếm"
              allowClear
              enterButton
              onSearch={onSearch}
              size="large"
              loading={loading}
            />
          </Row>
          {users.length > 0 && (
            <div style={{ background: "white", padding: "20px 0" }}>
              <div style={{ marginBottom: "20px" }}>Người dùng</div>
              <Row gutter={[5, 5]}>
                {users.map((user) => {
                  return (
                    <Col xs={12} key={user.id}>
                      <UserCardV2 user={user} />
                    </Col>
                  );
                })}
              </Row>
            </div>
          )}
          {posts.length > 0 && (
            <div style={{ background: "white", padding: "20px 0" }}>
              <div style={{ marginBottom: "20px" }}>Bài viết</div>
              {/* <div className="left w-6/12 pr-4"> */}
              {posts.map((post) => (
                <div key={post.postId}>
                  <div className="feeds">
                    <div className="feed-wrapper mb-4">
                      <div className="feed-item border border-gray-400 rounded bg-white">
                        <div className="header border-b p-4 flex justify-between items-center">
                          <div className="left flex flex-row items-center">
                            <div className="user-img h-10 w-10 border rounded-full overflow-hidden mr-4">
                              <img
                                alt="avatar"
                                className="_6q-tv"
                                data-testid="user-avatar"
                                draggable="false"
                                src={post.user?.avatar}
                              />
                            </div>
                            <div className="user-name-and-place flex flex-col">
                              <span className="text-sm font-bold">{post.user?.username}</span>
                              <span className="text-xs font-light text-gray-900"></span>
                            </div>
                          </div>
                          <div className="right">
                            <svg
                              aria-label="More options"
                              className="_8-yf5 "
                              fill="#262626"
                              height="16"
                              viewBox="0 0 48 48"
                              width="16"
                            >
                              <circle
                                clipRule="evenodd"
                                cx="8"
                                cy="24"
                                fillRule="evenodd"
                                r="4.5"
                              ></circle>
                              <circle
                                clipRule="evenodd"
                                cx="24"
                                cy="24"
                                fillRule="evenodd"
                                r="4.5"
                              ></circle>
                              <circle
                                clipRule="evenodd"
                                cx="40"
                                cy="24"
                                fillRule="evenodd"
                                r="4.5"
                              ></circle>
                            </svg>
                          </div>
                        </div>
                        <div className="feed-img">
                          <MediaView slides={post.files}></MediaView>
                          {/* <Carousel slides={post.files}></Carousel> */}
                          {/* <img style={{ width: "100%" }}
                      src={post.files[0]}
                      alt=""
                    /> */}
                          {/* <video width="100%" height="500px" controls>
                      <source src={""} />
                    </video> */}
                        </div>
                        <div className="card-footer p-4">
                          <div className="top">
                            <LikeComponent
                              postId={post.postId}
                              numberOfLike={post.reactions.length}
                            />
                            <div className="caption text-sm mt-3">
                              <b>{post.user?.username} </b>
                              {post.caption}
                            </div>
                            <div className="post-date mt-1">
                              <span className="text-xs text-gray-900">
                                {new Date(post.createdAt).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div className="bottom border-t pt-3 mt-3">
                            <form className="wrapper flex">
                              <input
                                type="text"
                                className="text-sm h-10 w-full outline-none focus:outline-none w-10/12"
                                placeholder="Add a comment"
                              />
                              <button
                                className="text-blue-500 opacity-75 w-2/12 text-right font-bold"
                                type="submit"
                              >
                                post
                              </button>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {/* </div> */}
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default SearchPage;
