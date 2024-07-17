'use client';

import { Row, Col, Input, Form, Button, message } from 'antd';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons/faLock';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import { login } from '@/store/slices/authUser';
import styles from './page.module.scss';
import { removeAll } from '@/store/slices/search';

export default function Login() {
  const [inputs, setInputs] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  const dispatch = useDispatch();

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

      const response = await fetch(`${process.env.API}/api/v1/auth/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: inputs.username,
          password: inputs.password,
        }),
        credentials: 'include',
      });

      const res = await response.json();
      const data = res.data;

      if (res.error) {
        // fail
        setLoading(false);
        notify('error', res.message);
      } else {
        //  success
        setLoading(false);
        dispatch(login({ user: data.user, accessToken: data.accessToken }));
        notify('success', 'Đăng nhập thành công');
        dispatch(removeAll());
        setTimeout(() => {
          router.push('/');
        }, 1000);
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
        <Row className={styles.row} justify='center'>
          <Col xs={24} sm={20} xl={14}>
            <Row className={styles.card} gutter={{ xs: 0, md: 50 }}>
              <Col className={styles.left} span={0} md={12}>
                <img src='./login.jpg' alt='sign up image' />
                <Link href='/register'>Tạo tài khoản mới</Link>
              </Col>
              <Col className={styles.right} span={24} md={12}>
                <h2 style={{ marginBottom: '40px' }}>Đăng nhập</h2>
                <Form autoComplete='off' onFinish={handleSubmit}>
                  <label>Tài khoản</label>
                  <Form.Item
                    name='username'
                    rules={[
                      {
                        required: true,
                        message: 'Nhập tên tài khoản!',
                      },
                    ]}
                  >
                    <Input
                      size='large'
                      prefix={
                        <>
                          <FontAwesomeIcon icon={faUser} />
                          &nbsp;&nbsp;&nbsp;
                        </>
                      }
                      placeholder='Nhập tên tài khoản hoặc email'
                      name='username'
                      value={inputs.username}
                      onChange={handleChange}
                    />
                  </Form.Item>

                  <label>Mật khẩu</label>
                  <Form.Item
                    name='password'
                    rules={[
                      {
                        required: true,
                        message: 'Nhập mật khẩu của bạn!',
                      },
                    ]}
                  >
                    <Input.Password
                      size='large'
                      prefix={
                        <>
                          <FontAwesomeIcon icon={faLock} />
                          &nbsp;&nbsp;&nbsp;
                        </>
                      }
                      placeholder='Nhập mật khẩu'
                      name='password'
                      value={inputs.password}
                      onChange={handleChange}
                    />
                  </Form.Item>

                  <Link href='/forgot-password' style={{ fontSize: '16px' }}>
                    Quên mật khẩu?
                  </Link>

                  <Form.Item style={{ margin: '40px 0 0 0' }}>
                    <Button size='large' type='primary' htmlType='submit' disabled={loading}>
                      {loading ? 'Please wait...' : 'Đăng nhập'}
                    </Button>
                  </Form.Item>
                </Form>

                <Link className={styles.register} href='/register'>
                  Tạo tài khoản mới
                </Link>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
}
