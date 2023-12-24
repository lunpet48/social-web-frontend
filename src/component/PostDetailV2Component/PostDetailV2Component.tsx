import React, { useEffect, useState } from "react";
import MediaView from "../media-view";
import { Space } from "antd";
import CommentComponent from "../comment";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import MoreOption from "../more-option";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEarthAmericas, faLock, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { checkMediaType } from "@/utils";
import { MediaType } from "@/type/enum";
import VideoPlayerComponent from "../VideoPlayerComponent";

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
  updatedAt: string;
};

type reaction = {
  userId: string;
  postId: string;
  liked: boolean;
};

type comment = {
  userId: string;
  comment: string;
  repliedCommentId: string;
  createdAt: string;
};

const PostDetailV2Component = ({ postId }: { postId: string }) => {
  const [comment, setComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [likeNumber, setLikeNumber] = useState(0);
  const [post, setPost] = useState<post>({
    postId: postId,
    userId: "",
    postType: "",
    postMode: "",
    caption: "",
    tagList: [],
    files: [],
    reactions: [],
    createdAt: "",
    updatedAt: ""
  });
  const [user, setUser] = useState<user>({
    id: "",
    username: "",
    email: "",
    isLocked: false,
    bio: "",
    avatar: "",
    fullName: "",
  });
  const [comments, setComments] = useState<comment[]>([
    {
      userId: "",
      comment: "",
      repliedCommentId: "",
      createdAt: "",
    },
  ]);

  const handleCommentChange = (event: any) => {
    setComment(event.target.value);
  };

  const handlePostComment = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const fetchPostComment = async (postId: string) => {
        const response = await fetch(`${process.env.API}/api/v1/comment`, {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            postId: postId,
            comment: comment,
            repliedCommentId: null,
          }),
        });
        if (response.status == 200) {
          const data = await response.json();
          return data.data;
        } else if (response.status === 401) {
          console.log("JWT expired");
        }
      };
      const fetchComment = async (postId: string) => {
        const response = await fetch(`${process.env.API}/api/v1/posts/${postId}/comments`, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        if (response.status == 200) {
          const data = await response.json();
          return data.data;
        } else if (response.status === 401) {
          console.log("JWT expired");
        }
      };
      await fetchPostComment(postId);
      const comments: comment[] = await fetchComment(postId);
      setComments(comments);
      setComment("");
    }
  };
  const likeClick = async () => {
    if (liked === false) {
      setLikeNumber(likeNumber + 1);
      setLiked(true);
      const response = await fetch(`${process.env.API}/api/v1/post/${postId}/like`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (response.status == 200) {
        const data = await response.json();
        return data.data.liked;
      } else if (response.status === 401) {
        console.log("JWT expired");
      }
      setLikeNumber(likeNumber - 1);
      setLiked(false);
    } else {
      setLikeNumber(likeNumber - 1);
      setLiked(false);
      const response = await fetch(`${process.env.API}/api/v1/post/${postId}/like`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (response.status == 200) {
        const data = await response.json();
        return data.data;
      } else if (response.status === 401) {
        console.log("JWT expired");
      }
      setLikeNumber(likeNumber + 1);
      setLiked(true);
    }
  };

  const getLikeNumber = async () => {
    const response = await fetch(`${process.env.API}/api/v1/post/${postId}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    if (response.status == 200) {
      const data = await response.json();
      return data.data.reactions.length;
    } else if (response.status === 401) {
      console.log("JWT expired");
    }
  };

  const handleLikeClick = async () => {
    const isLiked = await likeClick();
    const likeNum = await getLikeNumber();
    setLiked(isLiked);
    setLikeNumber(likeNum);
  };

  const fetchPostDetail = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const fetchPost = async () => {
        const response = await fetch(`${process.env.API}/api/v1/post/${postId}`, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        if (response.status === 200) {
          const data = await response.json();
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
          return data.data;
        } else if (response.status === 401) {
          console.log("JWT expired");
        }
      };
      const fetchLiked = async (postId: string) => {
        const response = await fetch(`${process.env.API}/api/v1/post/${postId}/like`, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        if (response.status == 200) {
          const data = await response.json();
          return data.data;
        } else if (response.status === 401) {
          console.log("JWT expired");
        }
      };
      const fetchComment = async (postId: string) => {
        const response = await fetch(`${process.env.API}/api/v1/posts/${postId}/comments`, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        if (response.status == 200) {
          const data = await response.json();
          return data.data;
        } else if (response.status === 401) {
          console.log("JWT expired");
        }
      };

      const post: post = await fetchPost();
      setPost(post);
      const user: user = await fetchUserProfile(post?.userId);
      setUser(user);
      const reaction: reaction = await fetchLiked(post.postId);
      setLiked(reaction.liked);
      setLikeNumber(post.reactions.length);
      const comments: comment[] = await fetchComment(postId);
      setComments(comments);
    }
  };

  useEffect(() => {
    fetchPostDetail();
  }, []);

  return (
    <div className="relative" style={{ display: "flex", flexWrap: "wrap" }}>
      <div className="feed-img" style={{ flex: "50%" }}>
        {/* <MediaView slides={post?.files}></MediaView> */}
        {post && checkMediaType(post.files[0]) === MediaType.IMAGE ? (
          <MediaView slides={post?.files}></MediaView>
        ) : post && checkMediaType(post.files[0]) === MediaType.VIDEO ? (
          <VideoPlayerComponent src={post.files[0]} />
        ) : (
          <></>
        )}
      </div>
      <div className="header" style={{ flex: "50%" }}>
        <div className="flex grid grid-cols-1">
          <div className="header border-b pt-4 pb-4 pl-2 pr-2 flex justify-between items-center">
            <div className="left flex flex-row items-center">
              <div className="user-img h-10 w-10 border rounded-full overflow-hidden mr-2">
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
                <span className="text-xs font-light text-gray-900"></span>
              </div>
              {
                post.createdAt !== post.updatedAt ?
                <>
                  <svg
                    aria-label="More options"
                    className="_8-yf5 "
                    fill="darkgrey"
                    height="16"
                    viewBox="0 0 48 48"
                    width="16"
                  >
                    <circle
                        clipRule="evenodd"
                        cx="24"
                        cy="24"
                        fillRule="evenodd"
                        r="4.5"
                      ></circle>
                  </svg>
                  <span style={{ color: "darkgray" }}>Đã chỉnh sửa</span>
                </>
              : undefined
              }
              <svg
                aria-label="More options"
                className="_8-yf5 "
                fill="darkgrey"
                height="16"
                viewBox="0 0 48 48"
                width="16"
              >
                <circle
                  clipRule="evenodd"
                  cx="24"
                  cy="24"
                  fillRule="evenodd"
                  r="4.5"
                ></circle>
              </svg>
              {post.postMode == "PUBLIC" ?
                <FontAwesomeIcon icon={faEarthAmericas as IconProp} size="sm" style={{ color: "darkgrey", }} />
              : post.postMode == "FRIEND" ? <FontAwesomeIcon icon={faUserGroup as IconProp} size="sm" style={{ color: "darkgrey", }} />
              : <FontAwesomeIcon icon={faLock as IconProp} size="sm" style={{ color: "darkgrey", }} />
              }
            </div>
            <div className="right">
              <MoreOption post={post} user={user} userId={post.userId}></MoreOption>
            </div>
          </div>
          <div className="flex flex-column">
            <div
              className="prose max-w-screen-md overflow-y-auto"
              style={{ maxHeight: "40vh", backgroundColor: "#fff" }}
            >
              <div>
                {post.caption != "" ? (
                  <>
                    <div className="content pl-2 pr-2 pt-4 pb-2 flex">
                      <div className="left flex flex-row">
                        <div className="user-img h-10 w-10 border rounded-full overflow-hidden mr-2">
                          <img
                            alt="avatar"
                            className="_6q-tv"
                            data-testid="user-avatar"
                            draggable="false"
                            src={user?.avatar}
                          />
                        </div>
                      </div>
                      <div className="user-name-and-place mt-2">
                        <span className="text-sm font-bold">{user?.username} </span>
                        <span className="text-sm font-light text-gray-900">{post.caption}</span>
                      </div>
                    </div>
                    <div className="flex ml-14">
                      <Space>
                        <span className="text-sm font-light text-gray-900">
                          {/* {new Date(post.updatedAt).toLocaleString()} */}
                        </span>
                      </Space>
                    </div>
                  </>
                ) : undefined}
                {comments.map((comment, id) => (
                  <CommentComponent key={id} comment={comment}></CommentComponent>
                ))}
              </div>
            </div>
          </div>
          <div className="card-footer sticky bottom-0 bg-white">
            <div className="top border-t mt-2 pt-3 pb-3 pl-2 pr-2">
              <div className="icons flex flex-row justify-between items-center">
                <div className="left flex flex-row">
                  <button onClick={handleLikeClick}>
                    <div className="like mr-4">
                      {liked === true ? (
                        <HeartFilled style={{ fontSize: "25px", color: "#FF2F41" }} />
                      ) : (
                        <HeartOutlined style={{ fontSize: "25px" }} />
                      )}
                    </div>
                  </button>
                </div>
              </div>
              <div className="likes mt-1">
                <span className="font-bold text-sm">{likeNumber} likes</span>
              </div>
              <div className="post-date mt-1">
                <span className="text-xs text-gray-900">
                  {new Date(post.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
            <div className="bottom border-t pt-3 mt-3">
              <div className="wrapper flex">
                <input
                  type="text"
                  className="text-sm h-10 w-full outline-none focus:outline-none w-10/12 p-4"
                  placeholder="Thêm bình luận"
                  value={comment}
                  onChange={handleCommentChange}
                />
                <button
                  className="text-blue-500 opacity-75 w-2/12 text-right font-bold"
                  onClick={handlePostComment}
                  disabled={/^\s*$/.test(comment)}
                >
                  Đăng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailV2Component;
