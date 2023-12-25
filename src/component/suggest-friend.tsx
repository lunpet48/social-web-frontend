import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import SuggestUser from "./SuggestUser";
import RequestUser from "./RequestUser";
import { getIncomingRequest, getRecommendUser } from "@/services/friendService";

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

const SuggestFriend = () => {
  const [loadingPage, setLoadingPage] = useState(true);
  const [suggestUsers, setSuggestUsers] = useState<user[]>([]);
  const [requestFriends, setRequestFriends] = useState<relationship[]>([]);

  const router = useRouter();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchRequestFriend = async () => {
      try {
        const response = await getIncomingRequest();

        const data = await response.json();
        if (!data.error) {
          //success
          setRequestFriends(data.data);
          setLoadingPage(false);
        }
      } catch (err) {
        console.log(err);
      }
    };
    const fetchSuggestFriend = async () => {
      try {
        const response = await getRecommendUser();

        const data = await response.json();
        if (!data.error) {
          //success
          setSuggestUsers(data.data);

          setLoadingPage(false);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchSuggestFriend();
    fetchRequestFriend();
  }, []);

  if (loadingPage) return <Loading height="100vh" />;
  return (
    <>
      <div className="right w-12/12 h-screen overflow-visible h-full">
        <div className="first pl-4 w-full" style={{ top: "85px", maxWidth: "293px" }}>
          <div
            className="profile flex items-center  mb-4"
            onClick={() => {
              router.push(`/profile/${currentUser.username}`);
            }}
            style={{ cursor: "pointer" }}
          >
            <div className="avatar rounded-full overflow-hidden mr-3">
              <img
                src={`${
                  currentUser.avatar ? currentUser.avatar : "/default-avatar.jpg"
                }`}
                alt=""
                style={{ objectFit: "cover", width: "56px", height: "56px" }}
              />
            </div>
            <div className="user-name ">
              <span className="text-lg font-semibold text-gray-700">
                {currentUser.fullName}
              </span>
              <span className="text-sm text-gray-600  block">{currentUser.username}</span>
            </div>
          </div>
          {requestFriends.length > 0 && (
            <div className="suggestion-users" style={{ paddingBottom: "30px" }}>
              <div className="title flex w-full justify-between text-sm">
                <div className="left">
                  <h1 className="font-bold">Lời mời kết bạn</h1>
                </div>
              </div>

              {requestFriends.map((requestFriends, index) => {
                return <RequestUser user={requestFriends.user} key={index} />;
              })}
            </div>
          )}
          <div className="suggestion-users">
            <div className="title flex w-full justify-between text-sm">
              <div className="left">
                <h1 className="font-bold">Gợi ý kết bạn</h1>
              </div>
              {/* <div className="right">
                <span>Xem tất cả</span>
              </div> */}
            </div>
            {suggestUsers.map((user, index) => {
              return <SuggestUser user={user} key={index} />;
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default SuggestFriend;
