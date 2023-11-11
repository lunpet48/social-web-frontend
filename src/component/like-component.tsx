import { CommentOutlined, HeartFilled, HeartOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";

type reaction = {
    userId: string;
    postId: string;
    liked: boolean;
}

const LikeComponent = ({ postId, numberOfLike }: any) => {
    const [reaction, setReaction] = useState<reaction>();
    const [like, setLike] = useState<number>(numberOfLike);
    const likeClick = async () => {
        if (reaction?.liked === false) {
            const response = await fetch(`${process.env.API}/api/v1/post/${reaction?.postId}/like`, {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            });
            if (response.status == 200) {
                const data = await response.json();
                return data.data;
            } else if (response.status === 401) {
                console.log("JWT expired");
            }
        }
        else {
            const response = await fetch(`${process.env.API}/api/v1/post/${reaction?.postId}/like`, {
                method: "DELETE",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            });
            if (response.status == 200) {
                const data = await response.json();
                return data.data;
            } else if (response.status === 401) {
                console.log("JWT expired");
            }
        }
    };
    const likeNumber = async () => {
        const response = await fetch(`${process.env.API}/api/v1/post/${reaction?.postId}`, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        });
        if (response.status == 200) {
            const data = await response.json();
            return data.data.reactions.length;
        } else if (response.status === 401) {
            console.log("JWT expired");
        }
    }
    console.log(like);

    const handleLikeClick = async () => {
        const reaction = await likeClick();
        const like = await likeNumber();
        setReaction(reaction);
        setLike(like);
    }
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                const fetchLiked = async (postId: string) => {
                    const response = await fetch(`${process.env.API}/api/v1/post/${postId}/like`, {
                        method: "GET",
                        headers: {
                            Authorization: "Bearer " + token,
                        }
                    });
                    if (response.status == 200) {
                        const data = await response.json();
                        //console.log(data);
                        return data.data;
                    } else if (response.status === 401) {
                        console.log("JWT expired");
                    }
                };
                const reaction: reaction = await fetchLiked(postId);
                setReaction(reaction);
            }
        }
        fetchData();
    }, []);
    console.log(reaction);
    return (
        <>
            <div className="icons flex flex-row justify-between items-center">
                <div className="left flex flex-row">
                    <button onClick={handleLikeClick}>
                        <div className="like mr-4">
                            {reaction?.liked === true ? <HeartFilled style={{ fontSize: "25px", color: "#FF2F41" }} /> : <HeartOutlined style={{ fontSize: "25px" }} />}
                        </div>
                    </button>
                    <button>
                        <div className="comment mr-4">
                            <CommentOutlined style={{ fontSize: "25px" }} />
                        </div>
                    </button>
                </div>
            </div>
            <div className="likes mt-1">
                <span className="font-bold text-sm">{like} likes</span>
            </div>
        </>

    );
}

export default LikeComponent;