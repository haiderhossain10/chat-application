import { apiSlice } from "../api/apiSlice";
import io from "socket.io-client";

export const messagesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMessages: builder.query({
            query: (id) =>
                `/messages?conversationId=${id}&_sort=timestamp&_order=desc&_page=1&_limit=${process.env.REACT_APP_MESSAGES_PER_PAGE}`,

            transformResponse(res, meta) {
                return {
                    data: res,
                    totalChatCount: meta.response.headers.get("X-Total-Count"),
                };
            },
            async onCacheEntryAdded(
                arg,
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
            ) {
                // create socket
                const socket = io(process.env.REACT_APP_API_URL, {
                    reconnectionDelay: 1000,
                    reconnection: true,
                    reconnectionAttemps: 10,
                    transports: ["websocket"],
                    agent: false,
                    upgrade: false,
                    rejectUnauthorized: false,
                });

                try {
                    await cacheDataLoaded;
                    socket.on("message", (data) => {
                        updateCachedData((draft) => {
                            if (arg == data?.data.conversationId) {
                                draft.data.push(data?.data);
                            }
                        });
                    });
                } catch (err) {}

                await cacheEntryRemoved;
                socket.close();
            },
        }),
        getMoreMessages: builder.query({
            query: ({ id, page }) =>
                `/messages?conversationId=${id}&_sort=timestamp&_order=desc&_page=${page}&_limit=${process.env.REACT_APP_MESSAGES_PER_PAGE}`,

            async onQueryStarted({ id }, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled;
                    if (data?.length > 0) {
                        dispatch(
                            apiSlice.util.updateQueryData(
                                "getMessages",
                                id,
                                (draft) => {
                                    return {
                                        data: [...draft.data, ...data],
                                        totalChatCount: Number(
                                            draft.totalChatCount
                                        ),
                                    };
                                }
                            )
                        );
                    }
                } catch (error) {}
            },
        }),
        addMessage: builder.mutation({
            query: (data) => ({
                url: "/messages",
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export const {
    useGetMessagesQuery,
    useGetMoreMessagesQuery,
    useAddMessageMutation,
} = messagesApi;
