"use client";
import React, { useState } from "react";
import { Layout, Menu, Space, MenuProps } from "antd";
import Link from "next/link";
import { InstagramOutlined, HomeOutlined, SearchOutlined, MessageOutlined } from "@ant-design/icons";

const labelContents = ["Trang chủ", "Tìm kiếm", "Tin nhắn"];

const items: MenuProps["items"] = [HomeOutlined, SearchOutlined, MessageOutlined].map((icon, index) => ({
  key: String(index + 1),
  icon: React.createElement(icon, {
    style: { fontSize: "25px", marginRight: "5px" },
  }),
  label: <span style={{ fontSize: "16px" }}>{labelContents[index]}</span>,
  style: { margin: "0px 0px 15px 4px", padding: "0px 0px 0px 24px" },
}));

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

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
                  <InstagramOutlined style={{ fontSize: "50px", color: "#000000" }} />
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
            <Menu theme="light" mode="inline" defaultSelectedKeys={["1"]} items={items} />
          </Layout.Sider>
          <Layout className="site-layout" style={{ marginLeft: 300 }}>
            {children}
          </Layout>
        </Layout>
      </body>
    </html>
  );
}
