import { useAuth } from "@/context/AuthContext";
import { acceptFriendRequest, denyFriendRequest } from "@/services/friendService";
import { Button, Col, Row } from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

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

const RequestUser = ({ user }: { user: user }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ isSuccess: false, text: "" });

  const router = useRouter();
  const { currentUser } = useAuth();

  const handleAcceptFriendRequest = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    const token = localStorage.getItem("token");

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
  const handleDenyFriendRequest = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    const token = localStorage.getItem("token");

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

  const viewProfile = () => {
    router.push(`/profile/${user.username}`);
  };

  return (
    <div
      className="users-wrapper mt-4 flex w-full justify-between items-center"
      onClick={viewProfile}
    >
      <div className="user-item flex flex-row pl-2" style={{ width: "100%" }}>
        <div className="user-img h-10 w-10 border rounded-full overflow-hidden mr-4">
          <img
            alt="realdonaldtrump's profile picture"
            className=""
            src={`${user.avatar ? user.avatar : "/default-avatar.jpg"}`}
          />
        </div>
        <div style={{ flex: "1" }}>
          <div className="user-name flex flex-col ">
            <span className="text-sm font-semibold">{user.fullName}</span>
            <span className="text-xs -mt-1 text-gray-700">{user.username}</span>
          </div>
          <Row gutter={5} style={{ width: "100%" }}>
            {loading ? (
              <Col xs={24}>
                <Button style={{ width: "100%", background: "#efefef" }} disabled>
                  Loading
                </Button>
              </Col>
            ) : status.isSuccess ? (
              <Col xs={24}>
                <Button
                  style={{
                    width: "100%",
                    background: "#04AA6D",
                    color: "white",
                  }}
                  disabled
                >
                  {status.text}
                </Button>
              </Col>
            ) : (
              <>
                <Col xs={12}>
                  <Button
                    type="primary"
                    style={{ width: "100%", fontSize: "14px", padding: "0" }}
                    onClick={(e) => {
                      handleAcceptFriendRequest(e);
                    }}
                  >
                    Chấp nhận
                  </Button>
                </Col>
                <Col xs={12}>
                  <Button
                    style={{
                      width: "100%",
                      fontSize: "14x",
                      background: "#efefef",
                    }}
                    onClick={(e) => {
                      handleDenyFriendRequest(e);
                    }}
                  >
                    Từ chối
                  </Button>
                </Col>
              </>
            )}
          </Row>
        </div>
      </div>
      {/* <span
        // href=""
        className="follow text-blue-600 text-sm font-semibold"
        style={{ cursor: "pointer" }}
        onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
          const button = event.target as HTMLButtonElement;
          if (button) {
            button.innerText = "Loading";
          }
        }}
      >
        Kết bạn
      </span> */}
    </div>
  );
};

export default RequestUser;
