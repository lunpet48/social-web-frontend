import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";

import UserCard from "@/component/UserCard";
import Loading from "@/component/Loading";
import { getOutgoingRequest } from "@/services/friendService";
import { user } from "@/type/type";

const FriendRequestHaveBeenSent = () => {
  const [loadingPage, setLoadingPage] = useState(true);
  const [users, setUsers] = useState<user[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getOutgoingRequest();

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

  if (loadingPage) {
    return <Loading />;
  }

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>Lời mời đã gửi</div>
      <Row gutter={[5, 5]}>
        {users.map((user, index) => {
          return (
            <Col xs={6} key={index}>
              <UserCard user={user} />
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default FriendRequestHaveBeenSent;
