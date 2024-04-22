'use client';
import React, { useState } from 'react';

import styles from './page.module.scss';
import FriendRequest from './FriendRequest';
import FriendRequestHaveBeenSent from './FriendRequestHaveBeenSent';
import Friend from './Friend';
//import Block from "./Block";

enum pages {
  Friend,
  FriendRequest,
  FriendRequestHaveBeenSent,
  //  Block,
}

const People = () => {
  const [page, setPage] = useState(pages.Friend);
  let ContentPage;
  switch (page) {
    case pages.Friend:
      ContentPage = Friend;
      break;
    case pages.FriendRequest:
      ContentPage = FriendRequest;
      break;
    case pages.FriendRequestHaveBeenSent:
      ContentPage = FriendRequestHaveBeenSent;
      break;
    // case pages.Block:
    //   ContentPage = Block;
    //   break;
    default:
      ContentPage = Friend;
      break;
  }
  return (
    <div className={styles['content']}>
      <ul className={styles['tablist']}>
        <li
          className={`${styles['tab-item']} ${page == pages.Friend && styles['active']} noselect`}
          onClick={() => {
            setPage(pages.Friend);
          }}
        >
          Bạn bè
        </li>
        <li
          className={`${styles['tab-item']} ${
            page == pages.FriendRequestHaveBeenSent && styles['active']
          } noselect`}
          onClick={() => {
            setPage(pages.FriendRequestHaveBeenSent);
          }}
        >
          Đã gửi
        </li>
        <li
          className={`${styles['tab-item']} ${
            page == pages.FriendRequest && styles['active']
          } noselect`}
          onClick={() => {
            setPage(pages.FriendRequest);
          }}
        >
          Yêu cầu kết bạn
        </li>
        {/* <li
          className={`${styles["tab-item"]} ${
            page == pages.Block && styles["active"]
          }`}
          onClick={() => {
            setPage(pages.Block);
          }}
        >
          Đã chặn
        </li> */}
      </ul>
      <ContentPage />
    </div>
  );
};

export default People;
