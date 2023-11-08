const SugguestFriend = () => {
    return (
        <>
            <div className="right w-4/12 h-screen overflow-visible h-full">
                <div
                    className="first pl-4 w-full"
                    style={{ top: "85px", maxWidth: "293px" }}
                >
                    <div className="profile flex items-center p-3 mb-4">
                        <div className="avatar rounded-full overflow-hidden mr-3">
                            <img
                                width="56px"
                                height="56px"
                                src="https://yt3.googleusercontent.com/WoDkWmAjQ5Dbw-ccjqFku8ThK2UYcqaOqq25PBE9eGb_S-vsqxiKU2kL2kZJVz_BcAMv3WUWsA=s900-c-k-c0x00ffffff-no-rj"
                                alt=""
                            />
                        </div>
                        <div className="user-name ">
                            <span className="text-lg font-semibold text-gray-700">
                                u__graphics
                            </span>
                            <span className="text-sm text-gray-600  block">Ugraphics</span>
                        </div>
                    </div>
                    <div className="suggestion-users">
                        <div className="title flex w-full justify-between text-sm">
                            <div className="left">
                                <h1 className="font-bold">Suggestions For You</h1>
                            </div>
                            <div className="right">
                                <span>See All</span>
                            </div>
                        </div>

                        <div className="users-wrapper mt-4 flex w-full justify-between items-center">
                            <div className="user-item flex flex-row pl-2">
                                <div className="user-img h-10 w-10 border rounded-full overflow-hidden mr-4">
                                    <img
                                        alt="realdonaldtrump's profile picture"
                                        className=""
                                        src="https://yt3.googleusercontent.com/WoDkWmAjQ5Dbw-ccjqFku8ThK2UYcqaOqq25PBE9eGb_S-vsqxiKU2kL2kZJVz_BcAMv3WUWsA=s900-c-k-c0x00ffffff-no-rj"
                                    />
                                </div>
                                <div className="user-name flex flex-col ">
                                    <span className="text-sm font-semibold">
                                        realdonaldtrump
                                    </span>
                                    <span className="text-xs -mt-1 text-gray-700">populer</span>
                                </div>
                            </div>
                            <a
                                href=""
                                className="follow text-blue-600 text-sm font-semibold"
                            >
                                follow
                            </a>
                        </div>

                        <div className="users-wrapper mt-4 flex w-full justify-between items-center">
                            <div className="user-item flex flex-row pl-2">
                                <div className="user-img h-10 w-10 border rounded-full overflow-hidden mr-4">
                                    <img
                                        alt="shinzoabe's profile picture"
                                        className="_6q-tv"
                                        data-testid="user-avatar"
                                        draggable="false"
                                        src="https://yt3.googleusercontent.com/WoDkWmAjQ5Dbw-ccjqFku8ThK2UYcqaOqq25PBE9eGb_S-vsqxiKU2kL2kZJVz_BcAMv3WUWsA=s900-c-k-c0x00ffffff-no-rj"
                                    />
                                </div>
                                <div className="user-name flex flex-col ">
                                    <span className="text-sm font-semibold">shinzoabe</span>
                                    <span className="text-xs -mt-1 text-gray-700">populer</span>
                                </div>
                            </div>
                            <a
                                href=""
                                className="follow text-blue-600 text-sm font-semibold"
                            >
                                follow
                            </a>
                        </div>

                        <div className="users-wrapper mt-4 flex w-full justify-between items-center">
                            <div className="user-item flex flex-row pl-2">
                                <div className="user-img h-10 w-10 border rounded-full overflow-hidden mr-4">
                                    <img
                                        alt="nike's profile picture"
                                        className="_6q-tv"
                                        data-testid="user-avatar"
                                        draggable="false"
                                        src="https://yt3.googleusercontent.com/WoDkWmAjQ5Dbw-ccjqFku8ThK2UYcqaOqq25PBE9eGb_S-vsqxiKU2kL2kZJVz_BcAMv3WUWsA=s900-c-k-c0x00ffffff-no-rj"
                                    />
                                </div>
                                <div className="user-name flex flex-col ">
                                    <span className="text-sm font-semibold">nike</span>
                                    <span className="text-xs -mt-1 text-gray-700">populer</span>
                                </div>
                            </div>
                            <a
                                href=""
                                className="follow text-blue-600 text-sm font-semibold"
                            >
                                follow
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SugguestFriend;