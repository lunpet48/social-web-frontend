'use client';

import { Row, Col, Input, Form, Button, message } from 'antd';
import styles from './page.module.scss';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons/faLock';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { requestSendOtpForgotPasword, resetPassword } from '@/services/authService';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const [inputs, setInputs] = useState({ email: '', newPassword: '', otpCode: '' });
  const [loading, setLoading] = useState(false);
  const [isRequestSendOTPToEmail, setIsRequestSendOTPToEmail] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  const router = useRouter();

  const handleChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const notify = (type: any, message: string) => {
    messageApi.open({
      type: type,
      content: message,
    });
  };

  const handleSubmit = async (event: any) => {
    try {
      setLoading(true);
      if (!isRequestSendOTPToEmail) {
        const response = await requestSendOtpForgotPasword({ email: inputs.email });
        if (response.status >= 200 && response.status < 300) {
          //  success
          setLoading(false);
          setIsRequestSendOTPToEmail(true);
          notify('success', 'Hệ thống đã gửi mã OTP đến email của bạn, hãy kiểm tra email!');
        } else {
          // fail
          const data = await response.json();
          setLoading(false);
          notify('error', data.message);
        }
        return;
      }

      const response = await resetPassword(inputs);
      if (response.status >= 200 && response.status < 300) {
        //  success
        setLoading(false);
        notify('success', 'Đã đổi mật khẩu thành công');
        setTimeout(() => {
          router.push('/login');
        }, 1000);
      } else {
        // fail
        const data = await response.json();
        setLoading(false);
        notify('error', data.message);
      }
    } catch (err) {
      console.log(err);
      notify('error', JSON.stringify(err));
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div className={styles.wrapper}>
        <Row className={styles.row} justify="center">
          <Col xs={24} sm={20} xl={12}>
            <Row className={styles.card}>
              <Col className={styles.right} span={24}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%',
                  }}
                >
                  <h2 style={{ marginBottom: '40px' }}>Quên mật khẩu</h2>
                  <Form autoComplete="off" onFinish={handleSubmit}>
                    <label>Email</label>
                    <Form.Item
                      name="email"
                      rules={[
                        {
                          required: true,
                          message: 'Nhập email của bạn!',
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
                        placeholder="Nhập email"
                        name="email"
                        value={inputs.email}
                        onChange={handleChange}
                      />
                    </Form.Item>
                    {!isRequestSendOTPToEmail && (
                      <Button size="large" type="primary" htmlType="submit" disabled={loading}>
                        {loading ? 'Please wait...' : 'Tiếp tục'}
                      </Button>
                    )}
                    {isRequestSendOTPToEmail && (
                      <>
                        <label>Mật khẩu mới</label>
                        <Form.Item
                          name="newPassword"
                          rules={[
                            {
                              required: true,
                              message: 'Nhập mật khẩu mới',
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
                            placeholder="Nhập mật khẩu mới"
                            name="newPassword"
                            value={inputs.newPassword}
                            onChange={handleChange}
                          />
                        </Form.Item>

                        <label>Mã OTP</label>
                        <Form.Item
                          name="otpCode"
                          rules={[
                            {
                              required: true,
                              message: 'Nhập mã otp của bạn !',
                            },
                          ]}
                        >
                          <Input
                            size="large"
                            placeholder="Nhập otp"
                            name="otpCode"
                            value={inputs.otpCode}
                            onChange={handleChange}
                          />
                        </Form.Item>

                        <Form.Item style={{ marginTop: '10px' }}>
                          <Button size="large" type="primary" htmlType="submit" disabled={loading}>
                            {loading ? 'Please wait...' : 'Xác nhận'}
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form>
                  <Link href="/login" style={{ fontSize: '16px', textDecoration: 'underline' }}>
                    Trở về đăng nhập
                  </Link>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
}
