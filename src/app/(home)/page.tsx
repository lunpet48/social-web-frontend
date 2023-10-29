"use client";
import React, { useState } from "react";
import "./index.css";

import { Layout, theme } from "antd";
import Container from "react-bootstrap/Container";
import "bootstrap/dist/css/bootstrap.min.css";
import PostView from "../../component/post";

const { Content } = Layout;

const Home = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
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
  );
};

export default Home;
