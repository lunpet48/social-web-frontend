"use client";
import React, { useState } from "react";
import "./index.css";
import {
  InstagramOutlined,
  HomeOutlined,
  SearchOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu, Space, theme } from "antd";
import Container from "react-bootstrap/Container";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
import PostView from "../../component/post";

const { Content, Sider } = Layout;

const labelContents = ["Trang chủ", "Tìm kiếm", "Tin nhắn"];

const items: MenuProps["items"] = [
  HomeOutlined,
  SearchOutlined,
  MessageOutlined,
].map((icon, index) => ({
  key: String(index + 1),
  icon: React.createElement(icon, {
    style: { fontSize: "25px", marginRight: "5px" },
  }),
  label: <span style={{ fontSize: "16px" }}>{labelContents[index]}</span>,
  style: { margin: "0px 0px 15px 4px", padding: "0px 0px 0px 24px" },
}));
const Home = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout hasSider>
      <Sider
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
              {React.createElement(InstagramOutlined, {
                style: { fontSize: "50px", color: "#000000" },
              })}
              <span
                style={{
                  color: "#000000",
                  fontSize: "30px",
                  fontFamily: "monospace",
                }}
              >
                Instagram
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
      </Sider>
      <Layout className="site-layout" style={{ marginLeft: 300 }}>
        <Container>
          <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
            <div
              style={{
                padding: 24,
                background: colorBgContainer,
              }}
            >
              {/* <p>long content</p>
            {
              // indicates very long content
              Array.from({ length: 100 }, (_, index) => (
                <React.Fragment key={index}>
                  {index % 20 === 0 && index ? 'more' : '...'}
                  <br />
                </React.Fragment>
              ))
            } */}
              <PostView></PostView>
            </div>
          </Content>
        </Container>
      </Layout>
    </Layout>
  );
};

export default Home;
