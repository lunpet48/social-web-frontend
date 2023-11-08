"use client";
import React, { useState } from "react";

import styles from "./page.module.scss";
import FriendRequest from "./FriendRequest";
import FriendRequestHaveBeenSent from "./FriendRequestHaveBeenSent";
import Friend from "./Friend";
import Block from "./Block";

enum pages {
  FriendRequest,
  FriendRequestHaveBeenSent,
  Friend,
  Block,
}

const People = () => {
  const [page, setPage] = useState(pages.FriendRequest);
  let Component;
  switch (page) {
    case pages.FriendRequest:
      Component = FriendRequest;
      break;
    case pages.Friend:
      Component = Friend;
      break;
    case pages.FriendRequestHaveBeenSent:
      Component = FriendRequestHaveBeenSent;
      break;
    case pages.Block:
      Component = Block;
      break;
    default:
      Component = FriendRequest;
      break;
  }
  return (
    <div style={{ background: "white", padding: "20px 30px" }}>
      <ul style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <li
          className={`${styles["tab-item"]} ${
            page == pages.FriendRequest ? styles["active"] : null
          }`}
          onClick={() => {
            setPage(pages.FriendRequest);
          }}
        >
          Lời mời kết bạn
        </li>
        <li
          className={`${styles["tab-item"]} ${
            page == pages.FriendRequestHaveBeenSent ? styles["active"] : null
          }`}
          onClick={() => {
            setPage(pages.FriendRequestHaveBeenSent);
          }}
        >
          Lời mời đã gửi
        </li>
        <li
          className={`${styles["tab-item"]} ${
            page == pages.Friend ? styles["active"] : null
          }`}
          onClick={() => {
            setPage(pages.Friend);
          }}
        >
          Bạn bè
        </li>
        {/* <li
          className={`${styles["tab-item"]} ${
            page == pages.Block ? styles["active"] : null
          }`}
          onClick={() => {
            setPage(pages.Block);
          }}
        >
          Đã chặn
        </li> */}
      </ul>
      <Component />
    </div>
  );
};

export default People;
