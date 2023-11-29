"use client";
import PostDetailV2Component from "@/component/PostDetailV2Component";
import React from "react";

const PostDetail = ({ params }: { params: { id: string } }) => {
  return (
    <div style={{ padding: "150px", background: "white" }}>
      <PostDetailV2Component postId={params.id} />
    </div>
  );
};

export default PostDetail;
