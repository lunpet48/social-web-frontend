import { Button, Col, Row } from "antd";
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

type relationship = {
  user: user;
  userRelated: user;
  status: string;
};

const FriendRequestHaveBeenSent = () => {
  const [relationships, setRelationships] = useState<relationship[]>([]);

  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.API}/api/v1/relationship/outgoing-requests`,
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
          setRelationships(data.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const viewProfile = () => {};
  const cancelRequest = async (
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
        setStatus({ isSuccess: true, text: "Đã hủy yêu cầu" });
      }
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>Lời mời đã gửi</div>
      <Row gutter={[5, 5]}>
        {relationships.map((relationship, index) => {
          return (
            <Col xs={6} key={index}>
              <UserCard
                user={relationship.userRelated}
                onClick={viewProfile}
                btnPrimary={{ text: "Hủy yêu cầu", onClick: cancelRequest }}
                btnSecondary={{
                  text: "Xem",
                  onClick: viewProfile,
                }}
              />
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default FriendRequestHaveBeenSent;
