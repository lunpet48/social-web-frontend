import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";

import UserCard from "@/component/UserCard";
import { useAuth } from "@/context/AuthContext";

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

const FriendRequest = () => {
  const [users, setUsers] = useState<user[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.API}/api/v1/user/recommend`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );

        const data = await response.json();
        if (!data.error) {
          //success
          setUsers(data.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const addFriend = async (
    user: user,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setStatus: React.Dispatch<
      React.SetStateAction<{ isSuccess: boolean; text: string }>
    >
  ) => {
    const token = localStorage.getItem("token");

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.API}/api/v1/relationship/friend-request`,
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
        setStatus({ isSuccess: true, text: "Đã gửi lời mời" });
      }
    } catch (err) {
      setLoading(false);
    }
  };
  const viewProfile = (user: user) => {};

  return (
    <>
      <div style={{ marginBottom: "20px" }}>Gợi ý kết bạn</div>
      <Row gutter={[5, 5]}>
        {users.map((user, index) => {
          return (
            <Col xs={6} key={index}>
              <UserCard
                user={user}
                onClick={viewProfile}
                btnPrimary={{ text: "Kết bạn", onClick: addFriend }}
                btnSecondary={{
                  text: "Xem",
                  onClick: viewProfile,
                }}
              />
            </Col>
          );
        })}
      </Row>
    </>
  );
};

export default FriendRequest;
