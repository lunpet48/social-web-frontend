import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import UserCard from "@/component/UserCard";
import Recommend from "./Recommend";
import Loading from "@/component/Loading";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  denyFriendRequest,
  getIncomingRequest,
} from "@/services/friendService";

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
  const [loadingPage, setLoadingPage] = useState(true);
  const [relationships, setRelationships] = useState<relationship[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getIncomingRequest();
        const data = await response.json();
        if (!data.error) {
          //success
          setRelationships(data.data);
          setLoadingPage(false);
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
  const handleAcceptFriendRequest = async (
    event: React.MouseEvent<HTMLElement>,
    user: user,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setStatus: React.Dispatch<React.SetStateAction<{ isSuccess: boolean; text: string }>>
  ) => {
    event.stopPropagation();

    try {
      setLoading(true);

      const response = await acceptFriendRequest(user.id);
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
  const handleDenyFriendRequest = async (
    event: React.MouseEvent<HTMLElement>,
    user: user,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setStatus: React.Dispatch<React.SetStateAction<{ isSuccess: boolean; text: string }>>
  ) => {
    event.stopPropagation();

    try {
      setLoading(true);
      const response = await denyFriendRequest(user.id);

      if (response.status >= 200 && response.status < 300) {
        //succcess
        setLoading(false);
        setStatus({ isSuccess: true, text: "Đã từ chối" });
      }
    } catch (err) {
      setLoading(false);
    }
  };

  if (loadingPage) {
    return <Loading />;
  }

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
                btnPrimary={{ text: "Chấp nhận", onClick: handleAcceptFriendRequest }}
                btnSecondary={{
                  text: "Từ chối",
                  onClick: handleDenyFriendRequest,
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
