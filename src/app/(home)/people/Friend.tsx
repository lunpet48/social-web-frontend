import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import UserCard from "@/component/UserCard";
import Loading from "@/component/Loading";
import { getFriend } from "@/services/friendService";
import { user } from "@/type/type";

const Friend = () => {
  const [loadingPage, setLoadingPage] = useState(true);
  const [users, setUsers] = useState<user[]>([]);

  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFriend(currentUser.id);

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
      <div style={{ marginBottom: "20px" }}>Bạn bè</div>
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

export default Friend;
