import { Space } from "antd";
import { useEffect, useState } from "react";

type user = {
    id: string;
    username: string;
    email: string;
    isLocked: false;
    bio: string;
    avatar: string;
    fullName: string;
};

const CommentComponent = ({ comment }: any) => {
    const [user, setUser] = useState<user>({
        id: "",
        username: "",
        email: "",
        isLocked: false,
        bio: "",
        avatar: "",
        fullName: "",
    });
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                const fetchUserProfile = async () => {
                    const response = await fetch(
                        `${process.env.API}/api/v1/profile?id=${comment.userId}`,
                        {
                            method: "GET",
                            headers: {
                                Authorization: "Bearer " + token,
                            },
                        }
                    );
                    if (response.status === 200) {
                        const data = await response.json();
                        return data.data;
                    } else if (response.status === 401) {
                        console.log("JWT expired");
                    }
                };

                const user: user = await fetchUserProfile();
                setUser(user);
            }
        };
        fetchData();
    }, [comment])
    return (
        <>
            <div className='content pl-2 pr-2 pt-4 pb-2 flex'>
                <div className="left flex flex-row">
                    <div className="user-img h-10 w-10 border rounded-full overflow-hidden mr-2">
                        <img
                            alt="avatar"
                            className="_6q-tv"
                            data-testid="user-avatar"
                            draggable="false"
                            src={user?.avatar}
                        />
                    </div>
                </div>
                <div className="user-name-and-place mt-2">
                    <span className="text-sm font-bold">{user?.username} </span>
                    <span className="text-sm font-light text-gray-900">
                        {comment.comment}
                    </span>
                </div>
            </div>
            <div className="flex ml-14">
                <Space>
                    <span className="text-sm font-light text-gray-900">{new Date(comment.createdAt).toLocaleString()}</span>
                    <a>Trả lời</a>
                </Space>
            </div>
        </>
    );
}
export default CommentComponent;