import { useAuth } from "@/context/AuthContext";
import React, { useState } from "react";
import Loading from "../Loading";
import { useRouter } from "next/navigation";

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

const SmallUserCard = ({ user }: { user: user }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ isSuccess: false, text: "" });

  const router = useRouter();
  const { currentUser } = useAuth();

  const addFriend = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    const token = localStorage.getItem("token");

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.API}/api/v1/relationship/friend-request`,
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
        setStatus({ isSuccess: true, text: "Đã gửi lời mời" });
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
      <div className="user-item flex flex-row pl-2">
        <div className="user-img h-10 w-10 border rounded-full overflow-hidden mr-4">
          <img
            alt="realdonaldtrump's profile picture"
            className=""
            src={`${user.avatar ? user.avatar : "/default-avatar.jpg"}`}
          />
        </div>
        <div className="user-name flex flex-col ">
          <span className="text-sm font-semibold">{user.fullName}</span>
          <span className="text-xs -mt-1 text-gray-700">{user.username}</span>
        </div>
      </div>
      {loading ? (
        <span className="follow text-blue-600 text-sm font-semibold">
          <Loading />
        </span>
      ) : status.isSuccess ? (
        <span className="follow text-green-600 text-sm font-semibold">
          {status.text}
        </span>
      ) : (
        <span
          // href=""
          className="follow text-blue-600 text-sm font-semibold"
          style={{ cursor: "pointer" }}
          onClick={(event) => {
            addFriend(event);
          }}
        >
          Kết bạn
        </span>
      )}
    </div>
  );
};

export default SmallUserCard;
