"use client";

import { Row, Col, Input, Form, Button } from "antd";
import { UserOutlined, LockFilled } from "@ant-design/icons";
import styles from "./page.module.scss";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons/faLock";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function Login() {
  return (
    <div className={styles.wrapper}>
      <Row className={styles.row} justify="center">
        <Col xs={24} sm={20} md={16}>
          <Row className={styles.card}>
            <Col className={styles.left} span={12}>
              <figure>
                <img src="./login.jpg" alt="sign up image" />
              </figure>
              <Link href="/register">Create an account</Link>
            </Col>
            <Col className={styles.right} span={12}>
              <h2 style={{ marginBottom: "40px" }}>Login</h2>
              <Form autoComplete="off">
                <label>Username</label>
                <Form.Item
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Please input your username",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    prefix={
                      <>
                        <FontAwesomeIcon icon={faUser} />
                        &nbsp;&nbsp;&nbsp;
                      </>
                    }
                    placeholder="Enter your username or email"
                  />
                </Form.Item>

                <label>Password</label>
                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                  ]}
                >
                  <Input.Password
                    size="large"
                    prefix={
                      <>
                        <FontAwesomeIcon icon={faLock} />
                        &nbsp;&nbsp;&nbsp;
                      </>
                    }
                    placeholder="Enter your password"
                  />
                </Form.Item>

                <Form.Item>
                  <Button size="large" type="primary" htmlType="submit">
                    Login
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}
