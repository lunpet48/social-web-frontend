import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "./index.module.scss";
import { faComment, faHeart } from "@fortawesome/free-solid-svg-icons";

const PostProfileComponent = ({
  src,
  onClick,
  likeNumber,
  commentNumber,
}: {
  src: string;
  onClick: () => void;
  likeNumber: number;
  commentNumber: number;
}) => {
  return (
    <div className={styles.container} onClick={onClick}>
      <img
        src={src}
        alt="post image"
        style={{ aspectRatio: "1/1", objectFit: "cover" }}
        className={styles.image}
      />
      <div className={styles.overlay}>
        <div className={styles.text}>
          <FontAwesomeIcon icon={faHeart} />
          {likeNumber} &nbsp;
          <FontAwesomeIcon icon={faComment} /> {commentNumber}
        </div>
      </div>
    </div>
  );
};

export default PostProfileComponent;
