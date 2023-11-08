import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import UserCard from "@/component/UserCard";
import Recommend from "./Recommend";
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

const FriendRequest = () => {
  const [relationships, setRelationships] = useState<relationship[]>([]);
  const router = useRouter();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.API}/api/v1/relationship/incoming-requests`,
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

  const viewProfile = (user: user) => {
    router.push(`/profile/${user.username}`);
  };
  const acceptFriendRequest = async (
    event: React.MouseEvent<HTMLElement>,
    user: user,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setStatus: React.Dispatch<
      React.SetStateAction<{ isSuccess: boolean; text: string }>
    >
  ) => {
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
  const denyFriendRequest = async (
    event: React.MouseEvent<HTMLElement>,
    user: user,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setStatus: React.Dispatch<
      React.SetStateAction<{ isSuccess: boolean; text: string }>
    >
  ) => {
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

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>Lời mời kết bạn</div>
      <Row gutter={[5, 5]}>
        {relationships.map((relationship, index) => {
          return (
            <Col xs={6} key={index}>
              <UserCard
                user={relationship.user}
                onClick={viewProfile}
                btnPrimary={{ text: "Chấp nhận", onClick: acceptFriendRequest }}
                btnSecondary={{
                  text: "Từ chối",
                  onClick: denyFriendRequest,
                }}
              />
            </Col>
          );
        })}
      </Row>
      <Recommend />
    </div>
  );
};

export default FriendRequest;
