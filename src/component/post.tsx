import { useEffect, useState } from "react";
import "./index.css";
import LikeComponent from "./like-component";
import MediaView from "./media-view";

type user = {
  id: string;
  username: string;
  email: string;
  isLocked: false;
  bio: string;
  avatar: string;
  fullName: string;
};

type post = {
  postId: string;
  userId: string;
  postType: string;
  postMode: string;
  caption: string;
  tagList: string[];
  files: string[];
  reactions: string[];
  createdAt: string;
};

const PostView = () => {
  const [result, setResult] = useState(new Map());

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const fetchPost = async () => {
          const response = await fetch(`${process.env.API}/api/v1/home`, {
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,
            },
          });
          if (response.status === 200) {
            const data = await response.json();
            // setUser(data.data);
            // setPosts(data.data);
            return data.data;
          } else if (response.status === 401) {
            console.log("JWT expired");
          }
        };
        const fetchUserProfile = async (userId: string) => {
          const response = await fetch(`${process.env.API}/api/v1/profile?id=${userId}`, {
            method: "GET",
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          });
          if (response.status === 200) {
            const data = await response.json();
            //setUser(data.data);
            return data.data;
          } else if (response.status === 401) {
            console.log("JWT expired");
          }
        };

        const map: Map<any, any> = new Map();

        const posts: post[] = await fetchPost();
        console.log(posts);

        for (let i = 0; i < posts.length; i++) {
          const user: user = await fetchUserProfile(posts[i].userId)

          map.set(posts[i], user);
        }

        setResult(map);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="left w-6/12 pr-4">
        {Array.from(result).map(([post, user], index) => (
          <div key={index}>
            <div className="feeds">
              <div className="feed-wrapper mb-4">
                <div className="feed-item border border-gray-400 rounded bg-white">
                  <div className="header border-b p-4 flex justify-between items-center">
                    <div className="left flex flex-row items-center">
                      <div className="user-img h-10 w-10 border rounded-full overflow-hidden mr-4">
                        <img
                          alt="avatar"
                          className="_6q-tv"
                          data-testid="user-avatar"
                          draggable="false"
                          src={user?.avatar}
                        />
                      </div>
                      <div className="user-name-and-place flex flex-col">
                        <span className="text-sm font-bold">{user?.username}</span>
                        <span className="text-xs font-light text-gray-900">
                        </span>
                      </div>
                    </div>
                    <div className="right">
                      <svg
                        aria-label="More options"
                        className="_8-yf5 "
                        fill="#262626"
                        height="16"
                        viewBox="0 0 48 48"
                        width="16"
                      >
                        <circle
                          clipRule="evenodd"
                          cx="8"
                          cy="24"
                          fillRule="evenodd"
                          r="4.5"
                        ></circle>
                        <circle
                          clipRule="evenodd"
                          cx="24"
                          cy="24"
                          fillRule="evenodd"
                          r="4.5"
                        ></circle>
                        <circle
                          clipRule="evenodd"
                          cx="40"
                          cy="24"
                          fillRule="evenodd"
                          r="4.5"
                        ></circle>
                      </svg>
                    </div>
                  </div>
                  <div className="feed-img">
                    <MediaView slides={post.files}></MediaView>
                    {/* <Carousel slides={post.files}></Carousel> */}
                    {/* <img style={{ width: "100%" }}
                      src={post.files[0]}
                      alt=""
                    /> */}
                    {/* <video width="100%" height="500px" controls>
                      <source src={""} />
                    </video> */}
                  </div>
                  <div className="card-footer p-4">
                    <div className="top">
                      <LikeComponent postId={post.postId} numberOfLike={post.reactions.length} />
                      <div className="caption text-sm mt-3">
                        <b>{user?.username} </b>
                        {post.caption}
                      </div>
                      <div className="post-date mt-1">
                        <span className="text-xs text-gray-900">
                          {new Date(post.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="bottom border-t pt-3 mt-3">
                      <form className="wrapper flex">
                        <input
                          type="text"
                          className="text-sm h-10 w-full outline-none focus:outline-none w-10/12"
                          placeholder="Add a comment"
                        />
                        <button
                          className="text-blue-500 opacity-75 w-2/12 text-right font-bold"
                          type="submit"
                        >
                          post
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default PostView;
