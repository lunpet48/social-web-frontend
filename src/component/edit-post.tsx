import { Dropdown, MenuProps, Modal, Select, Space, UploadFile, message } from 'antd';
import MediaView from './media-view';
import TextArea from 'antd/es/input/TextArea';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faEarthAmericas, faLock, faUserGroup } from '@fortawesome/free-solid-svg-icons';

const EditPost = ({ editPost, setEditPost, post, user }: any) => {
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState(post.caption);
    const [tag, setTag] = useState(post.tagList);
    const [postMode, setPostMode] = useState(post.postMode);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [messageApi, contextHolder] = message.useMessage();

    const handlePostMode = (value: string) => {
        setPostMode(value);
    };

    const handleChange = (event: any) => {
        const content = event.target.value;
        const pattern = /#[^\s!@#$%^&*()=+.\/,\[{\]};:'"?><]+/g;
        const found = content.match(pattern);
        const filterTag: string[] = found?.map((tag: string) => tag.substring(1));
        setTag(filterTag);
        setContent(content);
    };

    const notify = (type: any, message: string) => {
        messageApi.open({
            type: type,
            content: message,
        });
    };

    const handleSubmit = async () => {
        const formData: any = new FormData();

        const dto_object = new Blob(
            [
                JSON.stringify({
                    postId: post.postId,
                    userId: post.userId,
                    user: post.user,
                    postType: post.postType,
                    postMode: postMode,
                    caption: content,
                    tagList: tag,
                    files: post.files,
                }),
            ],
            {
                type: 'application/json',
            }
        );
        formData.append('postResponse', dto_object, '');
        for (let i = 0; i < fileList.length; i++) {
            formData.append('filesToUpdate', fileList[i].originFileObj);
        }
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.API}/api/v1/post`, {
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + token,
            },
            body: formData,
        });
        const data = await response.json();

        console.log(data);

        if (data.error === true) {
            // fail
            setLoading(false);
            setEditPost(false);
            notify('error', data.message);
        } else {
            //  success
            setLoading(false);
            setEditPost(false);
            notify('success', 'Chỉnh sửa bài viết thành công');
        }
    };
    return (
        // <Modal open={editPost} onCancel={() => setEditPost(false)} footer={[]} style={{
        //     border: ""
        // }}
        //     width={1500} centered>
        //     <div className="relative" style={{ display: "flex", flexWrap: "wrap" }}>
        //         <div className="feed-img" style={{ flex: "50%" }}>
        //             <MediaView slides={post?.files}></MediaView>
        //         </div>
        //         <div className="header" style={{ flex: "50%" }}>
        //             <div className='flex grid grid-cols-1'>
        //                 <div className="header border-b pt-4 pb-4 pl-2 pr-2 flex justify-between items-center">
        //                     <div className="left flex flex-row items-center">
        //                         <a className="user-img h-10 w-10 border rounded-full overflow-hidden mr-4" href={`/profile/${user?.username}`}>
        //                             <img
        //                                 alt="avatar"
        //                                 className="_6q-tv"
        //                                 data-testid="user-avatar"
        //                                 draggable="false"
        //                                 src={user?.avatar}
        //                             />
        //                         </a>
        //                         <a className="user-name-and-place flex flex-col no-underline text-gray-900 hover:text-gray-400" href={`/profile/${user?.username}`}>
        //                             <span className="text-sm font-bold">{user?.username}</span>
        //                             <span className="text-xs font-light text-gray-900">
        //                             </span>
        //                         </a>
        //                         {
        //                             post.createdAt !== post.updatedAt ?
        //                                 <>
        //                                     <svg
        //                                         aria-label="More options"
        //                                         className="_8-yf5 "
        //                                         fill="darkgrey"
        //                                         height="16"
        //                                         viewBox="0 0 48 48"
        //                                         width="16"
        //                                     >
        //                                         <circle
        //                                             clipRule="evenodd"
        //                                             cx="24"
        //                                             cy="24"
        //                                             fillRule="evenodd"
        //                                             r="4.5"
        //                                         ></circle>
        //                                     </svg>
        //                                     <span style={{ color: "darkgray" }}>Đã chỉnh sửa</span>
        //                                 </>
        //                                 : undefined
        //                         }
        //                         <svg
        //                             aria-label="More options"
        //                             className="_8-yf5 "
        //                             fill="darkgrey"
        //                             height="16"
        //                             viewBox="0 0 48 48"
        //                             width="16"
        //                         >
        //                             <circle
        //                                 clipRule="evenodd"
        //                                 cx="24"
        //                                 cy="24"
        //                                 fillRule="evenodd"
        //                                 r="4.5"
        //                             ></circle>
        //                         </svg>
        //                         {post.postMode == "PUBLIC" ?
        //                             <FontAwesomeIcon icon={faEarthAmericas as IconProp} size="sm" style={{ color: "darkgrey", }} />
        //                             : post.postMode == "FRIEND" ? <FontAwesomeIcon icon={faUserGroup as IconProp} size="sm" style={{ color: "darkgrey", }} />
        //                                 : <FontAwesomeIcon icon={faLock as IconProp} size="sm" style={{ color: "darkgrey", }} />
        //                         }
        //                     </div>
        //                     <div className="right">
        //                         <svg
        //                             aria-label="More options"
        //                             className="_8-yf5 "
        //                             fill="#262626"
        //                             height="16"
        //                             viewBox="0 0 48 48"
        //                             width="16"
        //                         >
        //                             <circle
        //                                 clipRule="evenodd"
        //                                 cx="8"
        //                                 cy="24"
        //                                 fillRule="evenodd"
        //                                 r="4.5"
        //                             ></circle>
        //                             <circle
        //                                 clipRule="evenodd"
        //                                 cx="24"
        //                                 cy="24"
        //                                 fillRule="evenodd"
        //                                 r="4.5"
        //                             ></circle>
        //                             <circle
        //                                 clipRule="evenodd"
        //                                 cx="40"
        //                                 cy="24"
        //                                 fillRule="evenodd"
        //                                 r="4.5"
        //                             ></circle>
        //                         </svg>
        //                     </div>
        //                 </div>
        //                 <div className="flex flex-column">
        //                     <div className="prose max-w-screen-md overflow-y-auto" style={{ maxHeight: "40vh", backgroundColor: "#fff" }}>
        //                         <div>
        //                             {post.caption != "" ? <>
        //                                 <div className='content pl-2 pr-2 pt-4 pb-2 flex'>
        //                                     <div className="left flex flex-row">
        //                                         <div className="user-img h-10 w-10 border rounded-full overflow-hidden mr-2">
        //                                             <img
        //                                                 alt="avatar"
        //                                                 className="_6q-tv"
        //                                                 data-testid="user-avatar"
        //                                                 draggable="false"
        //                                                 src={user?.avatar}
        //                                             />
        //                                         </div>
        //                                     </div>
        //                                     <div className="user-name-and-place mt-2">
        //                                         <span className="text-sm font-bold">{user?.username} </span>
        //                                         <span className="text-sm font-light text-gray-900">
        //                                             {post.caption}
        //                                         </span>
        //                                     </div>
        //                                 </div>
        //                                 <div className="flex ml-14">
        //                                     <Space>
        //                                         <span className="text-sm font-light text-gray-900">{new Date(post.createdAt).toLocaleString()}</span>
        //                                     </Space>
        //                                 </div></> : undefined}
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </Modal >
        <>
            {contextHolder}
            <Modal
                open={editPost}
                onCancel={() => setEditPost(false)}
                onOk={handleSubmit}
                width={1000}
            >
                <div className='relative' style={{ display: 'flex', flexWrap: 'wrap' }}>
                    <div className='feed-img' style={{ flex: '50%' }}>
                        <MediaView slides={post?.files}></MediaView>
                    </div>
                    <div className='header' style={{ flex: '50%' }}>
                        <div className='flex grid grid-cols-1'>
                            <div className='header border-b pt-4 pb-4 pl-2 pr-2 flex justify-between items-center'>
                                <div className='left flex flex-row items-center'>
                                    <div className='user-img h-10 w-10 border rounded-full overflow-hidden mr-2'>
                                        <img
                                            alt='avatar'
                                            className='_6q-tv'
                                            data-testid='user-avatar'
                                            draggable='false'
                                            src={user?.avatar}
                                        />
                                    </div>
                                    <div className='user-name-and-place flex flex-col'>
                                        <span className='text-sm font-bold'>{user?.username}</span>
                                        <span className='text-xs font-light text-gray-900'></span>
                                    </div>
                                    <svg
                                        aria-label='More options'
                                        className='_8-yf5 '
                                        fill='darkgrey'
                                        height='16'
                                        viewBox='0 0 48 48'
                                        width='16'
                                    >
                                        <circle
                                            clipRule='evenodd'
                                            cx='24'
                                            cy='24'
                                            fillRule='evenodd'
                                            r='4.5'
                                        ></circle>
                                    </svg>
                                    <Space>
                                        <span>Chế độ: </span>
                                        <Select
                                            defaultValue={postMode}
                                            style={{ width: 150 }}
                                            onChange={handlePostMode}
                                            options={[
                                                {
                                                    value: 'PUBLIC',
                                                    label: (
                                                        <span>
                                                            <FontAwesomeIcon
                                                                icon={faEarthAmericas as IconProp}
                                                                size='sm'
                                                                style={{ color: 'darkgrey' }}
                                                            />{' '}
                                                            Công Khai{' '}
                                                        </span>
                                                    ),
                                                },
                                                {
                                                    value: 'FRIEND',
                                                    label: (
                                                        <span>
                                                            <FontAwesomeIcon
                                                                icon={faUserGroup as IconProp}
                                                                size='sm'
                                                                style={{ color: 'darkgrey' }}
                                                            />{' '}
                                                            Bạn bè
                                                        </span>
                                                    ),
                                                },
                                                {
                                                    value: 'PRIVATE',
                                                    label: (
                                                        <span>
                                                            <FontAwesomeIcon
                                                                icon={faLock as IconProp}
                                                                size='sm'
                                                                style={{ color: 'darkgrey' }}
                                                            />{' '}
                                                            Riêng Tư
                                                        </span>
                                                    ),
                                                },
                                            ]}
                                        />
                                    </Space>
                                    {/* < Dropdown menu={{ items }
                                    } trigger={['click']} >
                                        <a onClick={(e) => e.preventDefault()}>
                                            {postMode == "PUBLIC" ?
                                                <FontAwesomeIcon icon={faEarthAmericas as IconProp} size="sm" style={{ color: "darkgrey", }} />
                                                : (post.postMode == "FRIEND" ? <FontAwesomeIcon icon={faUserGroup as IconProp} size="sm" style={{ color: "darkgrey", }} />
                                                    : <FontAwesomeIcon icon={faLock as IconProp} size="sm" style={{ color: "darkgrey", }} />)
                                            }
                                        </a>
                                    </Dropdown> */}
                                </div>
                            </div>
                            <div className='flex flex-column'>
                                <div
                                    className='prose max-w-screen-md overflow-y-auto'
                                    style={{ maxHeight: '40vh', backgroundColor: '#fff' }}
                                >
                                    <div>
                                        <div className='user-name-and-place m-2'>
                                            <TextArea
                                                defaultValue={content}
                                                autoSize={{ minRows: 3, maxRows: 20 }}
                                                onChange={handleChange}
                                            />
                                            {/* <span className="text-sm font-light text-gray-900">{post.caption}</span> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};
export default EditPost;
