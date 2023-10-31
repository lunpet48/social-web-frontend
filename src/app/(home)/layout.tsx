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
  MessageOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import CreatePost from "@/component/create-post";
import { root } from "postcss";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const labelContents = ["Trang chủ", "Tìm kiếm", "Tin nhắn", "Tạo bài"];

  const items: MenuProps["items"] = [
    HomeOutlined,
    SearchOutlined,
    MessageOutlined,
    PlusOutlined,
  ].map((icon, index) => ({
    key: String(index + 1),
    icon: React.createElement(icon, {
      style: { fontSize: "25px", marginRight: "5px" },
    }),
    label: <span style={{ fontSize: "16px" }}>{labelContents[index]}</span>,
    style: { margin: "0px 0px 15px 4px", padding: "0px 0px 0px 24px" },
    onClick: index == 3 ? () => setShowCreatePost(true) : undefined,
  }));
  const [collapsed, setCollapsed] = useState(false);
  const { loginContext } = useAuth();
  useEffect(() => {
    /// sau này sửa lại logic call RefreshToken API
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (user && token) {
      const userJson = JSON.parse(user);
      loginContext(userJson, token);
    }
  }, []);

  const [showCreatePost, setShowCreatePost] = useState(false);
  return (
    <html lang="en">
      <body>
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
      </body>
    </html>
  );
}
