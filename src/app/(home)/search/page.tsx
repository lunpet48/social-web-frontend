"use client";
import UserCard from "@/component/UserCard";
import PostView from "@/component/PostView";
import { post, user } from "@/type/type";
import { Col, Input, Row } from "antd";
import { SearchProps } from "antd/es/input";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const { Search } = Input;

const pattern = /^#[^\s!@#$%^&*()=+.\/,\[{\]};:'"?><]+$/g;

const SearchPage = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<user[]>([]);
  const [posts, setPosts] = useState<post[]>([]);

  const router = useRouter();

  const onSearch: SearchProps["onSearch"] = async (value, _e, info) => {
    if (info?.source == "input" && value.trim() !== "") {
      if (value.match(pattern)) {
        router.push(`/hashtag/${value.trim().substring(1)}`);
      }
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
          setUsers(data.data.users);
          setPosts(data.data.posts);
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
          {users?.length > 0 && (
            <div style={{ background: "white", padding: "20px 0" }}>
              <div style={{ marginBottom: "20px" }}>Người dùng</div>
              <Row gutter={[5, 5]}>
                {users.map((user) => {
                  return (
                    <Col xs={12} key={user.id}>
                      <UserCard user={user} />
                    </Col>
                  );
                })}
              </Row>
            </div>
          )}
          {posts?.length > 0 && (
            <div style={{ background: "white", padding: "20px 0" }}>
              <div style={{ marginBottom: "20px" }}>Bài viết</div>
              {/* <div className="left w-6/12 pr-4"> */}
              {posts.map((post) => (
                <div key={post.postId}>
                  <PostView post={post} />
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
