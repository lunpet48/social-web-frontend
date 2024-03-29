"use client";
import React, { useState } from "react";
import "./index.css";

import { Col, Layout, Row, Space, theme } from "antd";
import Container from "react-bootstrap/Container";
import "bootstrap/dist/css/bootstrap.min.css";
import PostView from "../../component/post";
import SuggestFriend from "@/component/suggest-friend";

const { Content } = Layout;

const Home = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <div style={{ backgroundColor: "white" }}>
      <Content style={{ margin: "0px", overflow: "initial" }}>
        <div
          style={{
            padding: "24px 10px 24px 50px",
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
          <Row>
            <Col xs={{ span: 10, offset: 3 }}>
              <PostView />
            </Col>
            <Col xs={{ span: 8, offset: 3 }}>
              <SuggestFriend />
            </Col>
          </Row>
          {/* <div style={{ display: "inline-flex", gap: "0px" }}>
            <PostView />
            <div className="w-1/12" />
            <SugguestFriend />
          </div> */}
        </div>
      </Content>
    </div>
  );
};

export default Home;
