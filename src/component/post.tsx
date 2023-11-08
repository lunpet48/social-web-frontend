import { useEffect, useState } from "react";
import "./index.css";

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
        console.log(map);


        // const result: user[] = [];

        // posts.forEach(async x => {
        //   const profile = await fetchUserProfile(x.userId);

        //   result.push(profile)
        // })
        // const users: user[] = result;

        // setData(user, posts);
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
                    <img style={{ width: "100%" }}
                      src={post.files[0]}
                      alt=""
                    />
                    {/* <video width="100%" height="500px" controls>
                      <source src={""} />
                    </video> */}
                  </div>
                  <div className="card-footer p-4">
                    <div className="top">
                      <div className="icons flex flex-row justify-between items-center">
                        <div className="left flex flex-row">
                          <div className="like mr-4">
                            <svg
                              aria-label="Like"
                              className="_8-yf5 "
                              fill="#262626"
                              height="24"
                              viewBox="0 0 48 48"
                              width="24"
                            >
                              <path d="M34.6 6.1c5.7 0 10.4 5.2 10.4 11.5 0 6.8-5.9 11-11.5 16S25 41.3 24 41.9c-1.1-.7-4.7-4-9.5-8.3-5.7-5-11.5-9.2-11.5-16C3 11.3 7.7 6.1 13.4 6.1c4.2 0 6.5 2 8.1 4.3 1.9 2.6 2.2 3.9 2.5 3.9.3 0 .6-1.3 2.5-3.9 1.6-2.3 3.9-4.3 8.1-4.3m0-3c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5.6 0 1.1-.2 1.6-.5 1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
                            </svg>
                          </div>
                          <div className="comment mr-4">
                            <svg
                              aria-label="Comment"
                              className="_8-yf5 "
                              fill="#262626"
                              height="24"
                              viewBox="0 0 48 48"
                              width="24"
                            >
                              <path
                                clipRule="evenodd"
                                d="M47.5 46.1l-2.8-11c1.8-3.3 2.8-7.1 2.8-11.1C47.5 11 37 .5 24 .5S.5 11 .5 24 11 47.5 24 47.5c4 0 7.8-1 11.1-2.8l11 2.8c.8.2 1.6-.6 1.4-1.4zm-3-22.1c0 4-1 7-2.6 10-.2.4-.3.9-.2 1.4l2.1 8.4-8.3-2.1c-.5-.1-1-.1-1.4.2-1.8 1-5.2 2.6-10 2.6-11.4 0-20.6-9.2-20.6-20.5S12.7 3.5 24 3.5 44.5 12.7 44.5 24z"
                                fillRule="evenodd"
                              ></path>
                            </svg>
                          </div>
                          <div className="share">
                            <svg
                              aria-label="Share Post"
                              className="_8-yf5 "
                              fill="#262626"
                              height="24"
                              viewBox="0 0 48 48"
                              width="24"
                            >
                              <path d="M47.8 3.8c-.3-.5-.8-.8-1.3-.8h-45C.9 3.1.3 3.5.1 4S0 5.2.4 5.7l15.9 15.6 5.5 22.6c.1.6.6 1 1.2 1.1h.2c.5 0 1-.3 1.3-.7l23.2-39c.4-.4.4-1 .1-1.5zM5.2 6.1h35.5L18 18.7 5.2 6.1zm18.7 33.6l-4.4-18.4L42.4 8.6 23.9 39.7z"></path>
                            </svg>
                          </div>
                        </div>
                        <div className="right">
                          <div className="save">
                            <svg
                              aria-label="Save"
                              className="_8-yf5 "
                              fill="#262626"
                              height="24"
                              viewBox="0 0 48 48"
                              width="24"
                            >
                              <path d="M43.5 48c-.4 0-.8-.2-1.1-.4L24 29 5.6 47.6c-.4.4-1.1.6-1.6.3-.6-.2-1-.8-1-1.4v-45C3 .7 3.7 0 4.5 0h39c.8 0 1.5.7 1.5 1.5v45c0 .6-.4 1.2-.9 1.4-.2.1-.4.1-.6.1zM24 26c.8 0 1.6.3 2.2.9l15.8 16V3H6v39.9l15.8-16c.6-.6 1.4-.9 2.2-.9z"></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="likes mt-1">
                        <span className="font-bold text-sm">0 likes</span>
                      </div>
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
