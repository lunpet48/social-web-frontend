import { Button } from "antd";
import React, { useState } from "react";

const ButtonWrapper = ({
  children,
  onClick,
  primary = false,
  style,
  danger = false,
}: {
  children: React.ReactNode;
  onClick: (setLoading: React.Dispatch<React.SetStateAction<boolean>>) => void;
  primary?: boolean;
  style?: React.CSSProperties;
  danger?: boolean;
}) => {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      type={primary ? "primary" : "default"}
      danger={danger}
      style={style}
      onClick={() => {
        onClick(setLoading);
      }}
      disabled={loading}
    >
      {loading ? "Loading" : children}
    </Button>
  );
};

export default ButtonWrapper;
