import { useDispatch, useSelector } from "react-redux";
import Message from "./Message";
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    messagesApi,
    useGetMessagesQuery,
} from "../../../features/messages/messagesApi";

export default function Messages({ messages = [] }) {
    const { user } = useSelector((state) => state.auth) || {};
    const { email } = user || {};
    const { id } = useParams();
    const dispatch = useDispatch();

    const { data } = useGetMessagesQuery(id) || {};
    const { data: getChats, totalChatCount } = data || {};

    const [hasMore, setHasMore] = useState(true);
    const [chatNumber, setChatNumber] = useState(1);

    const fetchMessages = () => {
        setChatNumber((oldChatNumber) => oldChatNumber + 1);
    };

    useEffect(() => {
        if (chatNumber > 1) {
            dispatch(
                messagesApi.endpoints.getMoreMessages.initiate({
                    id,
                    page: chatNumber,
                })
            );
        }
    }, [dispatch, id, chatNumber]);

    useEffect(() => {
        if (totalChatCount > 0) {
            const more =
                Math.ceil(
                    totalChatCount /
                        Number(process.env.REACT_APP_MESSAGES_PER_PAGE)
                ) > chatNumber;

            setHasMore(more);
        }
    }, [totalChatCount, chatNumber]);

    return (
        <div
            id="scrollableDiv"
            className="h-[calc(100vh_-_197px)] px-6 overflow-y-scroll"
            style={{
                overflow: "auto",
                display: "flex",
                flexDirection: "column-reverse",
            }}
        >
            <InfiniteScroll
                dataLength={messages.length}
                next={fetchMessages}
                hasMore={hasMore}
                inverse={true}
                loader={<h4>Loading...</h4>}
                scrollableTarget="scrollableDiv"
            >
                {messages
                    .slice()
                    .sort((a, b) => a.timestamp - b.timestamp)
                    .map((message, index) => {
                        const {
                            message: lastMessage,
                            id,
                            sender,
                        } = message || {};

                        const justify =
                            sender.email !== email ? "start" : "end";

                        const me = sender.email === email ? true : false;

                        return (
                            <Message
                                key={id}
                                justify={justify}
                                message={lastMessage}
                                select={me}
                            />
                        );
                    })}
            </InfiniteScroll>
        </div>
    );
}
