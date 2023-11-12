"use client";
import React, { useState, useEffect } from "react";
import { Layout, Menu, Space, MenuProps } from "antd";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const labelContents = ["Trang chủ", "Tìm kiếm", "Tin nhắn"];
import {
  InstagramOutlined,
  HomeOutlined,
  SearchOutlined,
  TeamOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import CreatePost from "@/component/create-post";
import { root } from "postcss";
import { useRouter } from "next/navigation";
import Icon from "@ant-design/icons/lib/components/Icon";
import { icon } from "@fortawesome/fontawesome-svg-core";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const labelContents = ["Trang chủ", "Tìm kiếm", "Bạn bè", "Tạo bài", "Trang cá nhân"];
  const { currentUser } = useAuth();
  const router = useRouter();
  const items: MenuProps["items"] = [
    HomeOutlined,
    SearchOutlined,
    TeamOutlined,
    PlusOutlined,
    UserOutlined
  ].map((icon, index) => ({
    key: String(index + 1),
    icon: React.createElement(icon, {
      style: { fontSize: "25px", marginRight: "5px" },
    }),
    label: <span className="noselect" style={{ fontSize: "16px" }}>{labelContents[index]}</span>,
    style: { margin: "0px 0px 15px 4px", padding: "0px 0px 0px 24px" },
    onClick: () => {
      switch (index) {
        case 0:
          router.push('/');
          break;
        case 1:
          router.push('');
          break;
        case 2:
          router.push('/people')
          break;
        case 3:
          setShowCreatePost(true);
          break;
        case 4:
          router.push('/profile/' + currentUser.username)
      }
    },
  }));

  const [collapsed, setCollapsed] = useState(false);
  const { loginContext } = useAuth();
  useEffect(() => {
    const refreshToken = async () => {
      try {
        const response = await fetch(
          `${process.env.API}/api/v1/auth/renew-token`,
          {
            method: "POST",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (data.error) {
          // fail
          console.log("fail : " + data.error);
          router.push("/login");
        } else {
          //  success
          loginContext(data.data.user, data.data.accessToken);
        }
      } catch (err) {
        console.log(err);
      }
    };

    refreshToken();
  }, []);

  const [showCreatePost, setShowCreatePost] = useState(false);
  return (
    <Layout hasSider>
      <Layout.Sider
        width={300}
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          borderRight: "1px solid #dcdcdc",
        }}
      >
        <div style={{ margin: "50px 10px" }}>
          <Link href={"/"} className="text-decoration-none">
            <Space size={"large"}>
              {/* {React.createElement(InstagramOutlined, {
                style: { fontSize: "50px", color: "#000000" },
              })}
              <img style={{ height: "3px" }} src="./logo.jpg" alt="logo" /> */}
              <InstagramOutlined
                style={{ fontSize: "50px", color: "#000000" }}
              />
              <span
                style={{
                  color: "#000000",
                  fontSize: "30px",
                  fontFamily: "monospace",
                }}
              >
                Sunny
              </span>
            </Space>
          </Link>
        </div>
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={items}
        />
        <CreatePost open={showCreatePost} setOpen={setShowCreatePost}></CreatePost>
      </Layout.Sider>
      <Layout className="site-layout" style={{ marginLeft: 300 }}>
        {children}
      </Layout>
    </Layout>
  );
}
