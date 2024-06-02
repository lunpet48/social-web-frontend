'use client';
import PostDetail from '@/component/PostDetail';
import { Modal } from 'antd';
import { useRouter } from 'next/navigation';

const Page = ({ params }: { params: { postid: string } }) => {
  const router = useRouter();
  const handleCancel = () => {
    router.back();
  };
  return (
    <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0 }}>
      <Modal open={true} footer={[]} onCancel={handleCancel} width={1200} centered>
        <PostDetail postId={params.postid} />
      </Modal>
    </div>
  );
};

export default Page;
