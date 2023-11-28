import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";

import UserCard from "@/component/UserCard";
import { useRouter } from "next/navigation";
import Loading from "@/component/Loading";
import { getRecommendUser, sendFriendRequest } from "@/services/friendService";

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
  const [loadingPage, setLoadingPage] = useState(true);
  const [users, setUsers] = useState<user[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getRecommendUser();
        const data = await response.json();
        if (!data.error) {
          //success
          setUsers(data.data);

          setLoadingPage(false);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const addFriend = async (
    event: React.MouseEvent<HTMLElement>,
    user: user,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setStatus: React.Dispatch<React.SetStateAction<{ isSuccess: boolean; text: string }>>
  ) => {
    event.stopPropagation();

    try {
      setLoading(true);

      const response = await sendFriendRequest(user.id);
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
  const viewProfile = (user: user) => {
    router.push(`/profile/${user.username}`);
  };

  if (loadingPage) {
    return <Loading />;
  }

  return (
    <>
      <div style={{ marginBottom: "20px", marginTop: "20px" }}>Gợi ý kết bạn</div>
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
                  onClick: (event: React.MouseEvent<HTMLElement>, user: user) => {
                    event.stopPropagation;
                    viewProfile(user);
                  },
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
