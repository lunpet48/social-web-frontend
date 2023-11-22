import { Button, Col, Row } from "antd";
import React, { Fragment, useState } from "react";

import styles from "./style.module.scss";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

enum RelationshipProfile {
  SELF = "SELF",
  STRANGER = "STRANGER",
  PENDING = "PENDING",
  INCOMMINGREQUEST = "INCOMMINGREQUEST",
  FRIEND = "FRIEND",
  BLOCK = "BLOCK",
}

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
  relationship: RelationshipProfile;
};

const UserCardV2 = ({ user }: { user: user }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ isSuccess: false, text: "" });

  const { currentUser } = useAuth();
  const router = useRouter();

  const addFriend = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    const token = localStorage.getItem("token");

    try {
      setLoading(true);
      const response = await fetch(`${process.env.API}/api/v1/relationship/friend-request`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser.id,
          userRelatedId: user.id,
        }),
      });

      const data = await response.json();

      if (!data.error) {
        //success
        setLoading(false);
        setStatus({ isSuccess: true, text: "Đã gửi lời mời" });
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const acceptFriendRequest = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    const token = localStorage.getItem("token");

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.API}/api/v1/relationship/received-friend-requests`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: currentUser.id,
            userRelatedId: user.id,
          }),
        }
      );

      const data = await response.json();

      if (!data.error) {
        //success
        setLoading(false);
        setStatus({ isSuccess: true, text: "Đã chấp nhận kết bạn" });
      }
    } catch (err) {
      setLoading(false);
    }
  };
  const denyFriendRequest = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    const token = localStorage.getItem("token");

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.API}/api/v1/relationship/received-friend-requests`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: currentUser.id,
            userRelatedId: user.id,
          }),
        }
      );

      if (response.status >= 200 && response.status < 300) {
        //succcess
        setLoading(false);
        setStatus({ isSuccess: true, text: "Đã từ chối" });
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const cancelRequest = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    const token = localStorage.getItem("token");

    try {
      setLoading(true);
      const response = await fetch(`${process.env.API}/api/v1/relationship/friend-request`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser.id,
          userRelatedId: user.id,
        }),
      });

      if (response.status >= 200 && response.status < 300) {
        //succcess
        setLoading(false);
        setStatus({ isSuccess: true, text: "Đã hủy yêu cầu" });
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const renderPrimaryButton = () => {
    switch (user.relationship) {
      case RelationshipProfile.STRANGER:
        return (
          <Button
            type="primary"
            style={{ width: "100%" }}
            onClick={(e) => {
              addFriend(e);
            }}
          >
            Kết bạn
          </Button>
        );
      case RelationshipProfile.INCOMMINGREQUEST:
        return (
          <Button
            type="primary"
            style={{ width: "100%" }}
            onClick={(e) => {
              acceptFriendRequest(e);
            }}
          >
            Chấp nhận
          </Button>
        );
      case RelationshipProfile.PENDING:
        return (
          <Button
            type="primary"
            style={{ width: "100%" }}
            onClick={(e) => {
              cancelRequest(e);
            }}
          >
            Hủy yêu cầu
          </Button>
        );
      case RelationshipProfile.FRIEND:
        return (
          <Button
            type="primary"
            style={{ width: "100%" }}
            onClick={(e) => {
              // addFriend(e);
            }}
          >
            Nhắn tin
          </Button>
        );
      default:
        return <></>;
    }
  };

  const deleteFriend = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    const token = localStorage.getItem("token");

    try {
      setLoading(true);
      const response = await fetch(`${process.env.API}/api/v1/relationship/friends`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser.id,
          userRelatedId: user.id,
        }),
      });

      if (response.status >= 200 && response.status < 300) {
        //succcess
        setLoading(false);
        setStatus({ isSuccess: true, text: "Đã xóa" });
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const renderSecondaryButton = () => {
    switch (user.relationship) {
      case RelationshipProfile.STRANGER:
        return (
          <Button
            style={{ width: "100%", background: "#efefef" }}
            onClick={(e) => {
              e.stopPropagation;
              router.push(`/profile/${user.username}`);
            }}
          >
            Xem
          </Button>
        );
      case RelationshipProfile.INCOMMINGREQUEST:
        return (
          <Button
            style={{ width: "100%", background: "#efefef" }}
            onClick={(e) => {
              denyFriendRequest(e);
            }}
          >
            Từ chối
          </Button>
        );
      case RelationshipProfile.PENDING:
        return (
          <Button
            style={{ width: "100%", background: "#efefef" }}
            onClick={(e) => {
              e.stopPropagation;
              router.push(`/profile/${user.username}`);
            }}
          >
            Xem
          </Button>
        );
      case RelationshipProfile.FRIEND:
        return (
          <Button
            style={{ width: "100%", background: "#efefef" }}
            onClick={(e) => {
              deleteFriend(e);
            }}
          >
            Xóa
          </Button>
        );
      default:
        return <></>;
    }
  };

  return (
    <div
      className={styles.card}
      onClick={() => {
        router.push(`/profile/${user.username}`);
      }}
    >
      <img
        style={{
          width: "100px",
          height: "100px",
          objectFit: "cover",
          borderRadius: "50%",
          background: "white",
        }}
        src={`${user.avatar ? user.avatar : "/default-avatar.jpg"}`}
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
            <Button style={{ width: "100%", background: "#04AA6D", color: "white" }} disabled>
              {status.text}
            </Button>
          </Col>
        ) : (
          <>
            <Col xs={12}>{renderPrimaryButton()}</Col>
            <Col xs={12}>{renderSecondaryButton()}</Col>
          </>
        )}
      </Row>
    </div>
  );
};

export default UserCardV2;
