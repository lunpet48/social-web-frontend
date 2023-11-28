import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import UserCard from "@/component/UserCard";
import Loading from "@/component/Loading";
import { deleteFriend, getFriend } from "@/services/friendService";

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

const Friend = () => {
  const [loadingPage, setLoadingPage] = useState(true);
  const [relationships, setRelationships] = useState<relationship[]>([]);

  const router = useRouter();

  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFriend(currentUser.id);

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
  const goToMessage = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    alert("Tính năng này chưa có");
  };
  const handleDeleteFriend = async (
    event: React.MouseEvent<HTMLElement>,
    user: user,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setStatus: React.Dispatch<React.SetStateAction<{ isSuccess: boolean; text: string }>>
  ) => {
    event.stopPropagation();

    try {
      setLoading(true);
      const response = await deleteFriend(user.id);

      if (response.status >= 200 && response.status < 300) {
        //succcess
        setLoading(false);
        setStatus({ isSuccess: true, text: "Đã xóa" });
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
      <div style={{ marginBottom: "20px" }}>Bạn bè</div>
      <Row gutter={[5, 5]}>
        {relationships.map((relationship, index) => {
          return (
            <Col xs={6} key={index}>
              <UserCard
                user={relationship.userRelated}
                onClick={viewProfile}
                btnPrimary={{ text: "Nhắn tin", onClick: goToMessage }}
                btnSecondary={{
                  text: "Xóa",
                  onClick: handleDeleteFriend,
                }}
              />
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default Friend;
