import { Image } from "antd";
import React from "react";

import styles from "./index.module.scss";

const ImagePreviewWrapper = ({
  wrapperStyle,
  imageStyle,
  src,
}: {
  wrapperStyle?: {};
  imageStyle?: {};
  src: string;
}) => {
  return (
    <div style={wrapperStyle}>
      <Image
        width={"100%"}
        preview={{
          mask: <></>,
          classNames: {
            wrapper: styles["preview-image"]
          },
        }}
        style={imageStyle}
        src={src}
      />
    </div>
  );
};

export default ImagePreviewWrapper;
