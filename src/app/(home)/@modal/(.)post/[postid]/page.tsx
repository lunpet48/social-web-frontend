"use client";
import PostDetailV2Component from "@/component/PostDetailV2Component";
import { Modal } from "antd";
import { useRouter } from "next/navigation";

const Page = ({ params }: { params: { postid: string } }) => {
  const router = useRouter();
  const handleCancel = () => {
    router.back();
  };
  return (
    <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, left: 0 }}>
      <Modal open={true} footer={[]} onCancel={handleCancel} width={1000} centered>
        <PostDetailV2Component postId={params.postid} />
      </Modal>
    </div>
  );
};

export default Page;
