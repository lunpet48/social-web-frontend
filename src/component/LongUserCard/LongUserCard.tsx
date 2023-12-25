import {
  acceptFriendRequest,
  cancelFriendRequest,
  deleteFriend,
  sendFriendRequest,
} from "@/services/friendService";
import { RelationshipProfile } from "@/type/enum";
import { user } from "@/type/type";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LongUserCard = ({ user }: { user: user }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ isSuccess: false, text: "" });
  const router = useRouter();

  const handleSendFriendRequest = async () => {
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

  const HandleAcceptFriendRequest = async () => {
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

  const handleCancelFriendRequest = async () => {
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

  const handleDeleteFriend = async () => {
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

  const renderActionButton = () => {
    switch (user.relationship) {
      case RelationshipProfile.STRANGER:
        return (
          <div
            style={{
              background: "#e4e6eb",
              padding: "8px 20px",
              fontWeight: "bold",
              fontSize: "14px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleSendFriendRequest();
            }}
          >
            Kết bạn
          </div>
        );
      case RelationshipProfile.INCOMMINGREQUEST:
        return (
          <div
            style={{
              background: "#e4e6eb",
              padding: "8px 20px",
              fontWeight: "bold",
              fontSize: "14px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.stopPropagation();
              HandleAcceptFriendRequest();
            }}
          >
            Chấp nhận
          </div>
        );
      case RelationshipProfile.PENDING:
        return (
          <div
            style={{
              background: "#e4e6eb",
              padding: "8px 20px",
              fontWeight: "bold",
              fontSize: "14px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleCancelFriendRequest();
            }}
          >
            Hủy yêu cầu
          </div>
        );
      case RelationshipProfile.FRIEND:
        return (
          <div
            style={{
              background: "#e4e6eb",
              padding: "8px 20px",
              fontWeight: "bold",
              fontSize: "14px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteFriend();
            }}
          >
            Xóa
          </div>
        );
      default:
        return <></>;
    }
  };
  const handleNavigateProfile = () => {
    router.push(`/profile/${user.username}`);
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "14px",
        // background: "#ccc",
      }}
    >
      <div
        style={{ display: "flex", gap: "20px", alignItems: "center", cursor: "pointer" }}
        onClick={handleNavigateProfile}
      >
        <div>
          <img
            style={{ borderRadius: "50%", width:"44px", height:"44px" }}
            src={`${user.avatar ? user.avatar : "/default-avatar.jpg"}`}
          />
        </div>
        <div>
          <div>{user.fullName}</div>
          <div>@{user.username}</div>
        </div>
      </div>
      <div>
        {loading ? (
          <Button style={{ width: "100%", background: "#efefef" }} disabled>
            Loading
          </Button>
        ) : status.isSuccess ? (
          <Button style={{ width: "100%", background: "#04AA6D", color: "white" }} disabled>
            {status.text}
          </Button>
        ) : (
          renderActionButton()
        )}
      </div>
    </div>
  );
};

export default LongUserCard;
