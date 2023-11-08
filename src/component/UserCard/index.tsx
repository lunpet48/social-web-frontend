import { Button, Col, Row } from "antd";
import React, { useState } from "react";

import styles from "./style.module.scss";

type user = {
  id: string;
  username: string;
  email: string;
  isLocked: false;
  bio: string;
  avatar: string;
  fullName: string;
  friendCount: number;
  postCount: number;
};

const UserCard = ({
  user,
  onClick,
  btnPrimary,
  btnSecondary,
}: {
  user: user;
  onClick: (user: user) => void;
  btnPrimary: {
    text: string;
    onClick: (
      event: React.MouseEvent<HTMLElement>,
      user: user,
      setLoading: React.Dispatch<React.SetStateAction<boolean>>,
      setStatus: React.Dispatch<
        React.SetStateAction<{ isSuccess: boolean; text: string }>
      >
    ) => void;
  };
  btnSecondary: {
    text: string;
    onClick: (
      event: React.MouseEvent<HTMLElement>,
      user: user,
      setLoading: React.Dispatch<React.SetStateAction<boolean>>,
      setStatus: React.Dispatch<
        React.SetStateAction<{ isSuccess: boolean; text: string }>
      >
    ) => void;
  };
}) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ isSuccess: false, text: "" });

  return (
    <div
      className={styles.card}
      onClick={() => {
        onClick(user);
      }}
    >
      <img
        style={{
          width: "100px",
          height: "100px",
          objectFit: "cover",
          borderRadius: "50%",
        }}
        src={`${user.avatar}`}
        alt="avatar"
      />

      <div>{`${user.fullName}`}</div>
      <div>@{`${user.username}`}</div>
      <Row gutter={5} style={{ width: "100%" }}>
        {loading ? (
          <Col xs={24}>
            <Button style={{ width: "100%", background: "#efefef" }} disabled>
              Loading
            </Button>
          </Col>
        ) : status.isSuccess ? (
          <Col xs={24}>
            <Button
              style={{ width: "100%", background: "#04AA6D", color: "white" }}
              disabled
            >
              {status.text}
            </Button>
          </Col>
        ) : (
          <>
            <Col xs={12}>
              <Button
                type="primary"
                style={{ width: "100%" }}
                onClick={(e) => {
                  btnPrimary.onClick(e, user, setLoading, setStatus);
                }}
              >
                {btnPrimary.text}
              </Button>
            </Col>
            <Col xs={12}>
              <Button
                style={{ width: "100%", background: "#efefef" }}
                onClick={(e) => {
                  btnSecondary.onClick(e, user, setLoading, setStatus);
                }}
              >
                {btnSecondary.text}
              </Button>
            </Col>
          </>
        )}
      </Row>
    </div>
  );
};

export default UserCard;
