import { Button } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const PostNotFound = () => {
  const router = useRouter();

  const redirectHome = () => {
    router.push('/');
  };

  const back = () => {
    router.back();
  };

  return (
    <div className='flex flex-col h-screen justify-center items-center gap-3 w-full'>
      <img src='/lock.png' alt='' width={200} />
      <div className='text-gray-text text-3xl font-bold'>Bài viết không tồn tại</div>
      <div className='text-gray-text text-lg font-semibold flex flex-col items-center'>
        <p>Bài viết này không tồn tại trong hệ thống,</p>
        <p>người đăng đã chặn hoặc bị chặn bởi bạn</p>
        <p>hoặc bài viết đã bị xóa</p>
      </div>
      <Button type='primary' size='large' className='text-lg font-medium' onClick={redirectHome}>
        Trở về trang chủ
      </Button>
      <Link href='' className='text-gray-text text-lg font-medium hover:underline' onClick={back}>
        Quay lại
      </Link>
    </div>
  );
};

export default PostNotFound;
