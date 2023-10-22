"use client";

import { Row, Col, Input, Form, Button } from "antd";
import styles from "./page.module.scss";
import Link from "next/link";
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 10,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 14,
    },
  },
};
export default function Register() {
  return (
    <div className={styles.wrapper}>
      <Row className={styles.row} justify="center">
        <Col xs={24} sm={20} md={16}>
          <Row className={styles.card}>
            <Col className={styles.left} span={12}>
              <h2 style={{ display: "block", textAlign: "center", marginBottom: "20px" }}>Register</h2>
              <Form autoComplete="off" {...formItemLayout} scrollToFirstError>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    {
                      type: "email",
                      message: "The input is not valid Email!",
                    },
                    {
                      required: true,
                      message: "Please input your Email!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="username"
                  label="Username"
                  rules={[
                    {
                      required: true,
                      message: "Please input your username!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="fullname"
                  label="Fullname"
                  rules={[
                    {
                      required: true,
                      message: "Please input your name!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item
                  name="confirm"
                  label="Confirm Password"
                  dependencies={["password"]}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error("The new password that you entered do not match!"));
                      },
                    }),
                  ]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item>
                  <Button size="large" type="primary" htmlType="submit">
                    Register
                  </Button>
                </Form.Item>
              </Form>
            </Col>

            <Col className={styles.right} span={12}>
              <figure>
                <img src="./register.jpg" alt="sign up image" />
              </figure>
              <Link href="/login">Create an account</Link>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}
