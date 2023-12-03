import { useAuth } from "@/context/AuthContext";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Button, Dropdown, MenuProps, Modal } from "antd";
import { useState } from "react";
import EditPost from "./edit-post";

const { confirm } = Modal;

const MoreOption = ({ post, user, userId }: any) => {
    const { currentUser } = useAuth();
    const [editPost, setEditPost] = useState(false);

    if (currentUser.id === userId) {
        const openEditModal = () => {
            setEditPost(true)
        }


        const items: MenuProps['items'] = [
            {
                label: <a onClick={openEditModal}>Chỉnh sửa bài viết</a>,
                key: '0',
            },
            {
                label: <a href="">Xóa bài viết</a>,
                key: '1',
            },
        ];
        return (
            <>
                < Dropdown menu={{ items }
                } trigger={['click']} >
                    <a onClick={(e) => e.preventDefault()}>
                        <svg
                            aria-label="More options"
                            className="_8-yf5 "
                            fill="#262626"
                            height="16"
                            viewBox="0 0 48 48"
                            width="16"
                        >
                            <circle clipRule="evenodd" cx="8" cy="24" fillRule="evenodd" r="4.5"></circle>
                            <circle clipRule="evenodd" cx="24" cy="24" fillRule="evenodd" r="4.5"></circle>
                            <circle clipRule="evenodd" cx="40" cy="24" fillRule="evenodd" r="4.5"></circle>
                        </svg>
                    </a>
                </Dropdown >
                <EditPost editPost={editPost} setEditPost={setEditPost} post={post} user={user}></EditPost>
                {/* <EditPost editPost={editPost} setEditPost={setEditPost} post={post} user={user}></EditPost> */}
            </>
        );
    }
    else {
        const showDeleteComfirm = () => {
            confirm({
                title: 'Bạn có chắc là muốn hủy kết bạn với người này không?',
                icon: <ExclamationCircleFilled />,
                content: '',
                okText: 'Có',
                okType: 'danger',
                cancelText: 'Không',
                onOk() {

                },
                onCancel() {
                    console.log('Cancel');
                },
            });
        }

        const items: MenuProps['items'] = [
            {
                label: <a onClick={showDeleteComfirm}>Hủy kết bạn</a>,
                key: '0',
            },
        ];
        return (
            < Dropdown menu={{ items }
            } trigger={['click']} >
                <a onClick={(e) => e.preventDefault()}>
                    <svg
                        aria-label="More options"
                        className="_8-yf5 "
                        fill="#262626"
                        height="16"
                        viewBox="0 0 48 48"
                        width="16"
                    >
                        <circle clipRule="evenodd" cx="8" cy="24" fillRule="evenodd" r="4.5"></circle>
                        <circle clipRule="evenodd" cx="24" cy="24" fillRule="evenodd" r="4.5"></circle>
                        <circle clipRule="evenodd" cx="40" cy="24" fillRule="evenodd" r="4.5"></circle>
                    </svg>
                </a>
            </Dropdown >
        );
    }
}

export default MoreOption;