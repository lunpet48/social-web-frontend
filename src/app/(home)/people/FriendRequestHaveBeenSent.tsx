import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";

import UserCard from "@/component/UserCard";
import { useRouter } from "next/navigation";
import Loading from "@/component/Loading";
import {
  cancelFriendRequest,
  getOutgoingRequest,
  getRecommendUser,
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

const FriendRequestHaveBeenSent = () => {
  const [loadingPage, setLoadingPage] = useState(true);
  const [relationships, setRelationships] = useState<relationship[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getOutgoingRequest();

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
  const handleCancelFriendRequest = async (
    event: React.MouseEvent<HTMLElement>,
    user: user,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setStatus: React.Dispatch<React.SetStateAction<{ isSuccess: boolean; text: string }>>
  ) => {
    event.stopPropagation();

    try {
      setLoading(true);
      const response = await cancelFriendRequest(user.id);

      if (response.status >= 200 && response.status < 300) {
        //succcess
        setLoading(false);
        setStatus({ isSuccess: true, text: "Đã hủy yêu cầu" });
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
      <div style={{ marginBottom: "20px" }}>Lời mời đã gửi</div>
      <Row gutter={[5, 5]}>
        {relationships.map((relationship, index) => {
          return (
            <Col xs={6} key={index}>
              <UserCard
                user={relationship.userRelated}
                onClick={viewProfile}
                btnPrimary={{ text: "Hủy yêu cầu", onClick: handleCancelFriendRequest }}
                btnSecondary={{
                  text: "Xem",
                  onClick: (event: React.MouseEvent<HTMLElement>, user: user) => {
                    event.stopPropagation();
                    viewProfile(user);
                  },
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
