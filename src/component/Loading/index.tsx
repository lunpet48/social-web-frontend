import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const Loading = ({
  width = "100%",
  height = "100%",
  fontSize = 36,
}: {
  width?: string;
  height?: string;
  fontSize?: number;
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "white",
        width,
        height,
      }}
    >
      <Spin
        indicator={
          <LoadingOutlined
            style={{
              fontSize,
            }}
            spin
          />
        }
      />
    </div>
  );
};

export default Loading;
