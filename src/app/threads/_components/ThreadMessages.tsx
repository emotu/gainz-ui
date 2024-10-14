import { useState, useEffect, useMemo, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Message from "./Message";
import { v4 as uuidv4 } from "uuid";

const WEBSOCKET_BASE_URL = "ws://localhost:8000/ws";

export default function Component({
    threadId,
    token,
    messages = [],
}: {
    threadId: string;
    token: string;
    messages: any[];
}) {
    const socketRef = useRef<WebSocket>();
    const scrollRef = useRef<ScrollArea>();
    const [incoming, setIncoming] = useState(false);
    const [threadMessages, setThreadMessages] = useState([]);
    const [streamedMessage, setStreamedMessage] = useState<{
        id: string;
        role: string;
        sender: string;
        content?: { text: { value: string }; type: string }[];
    } | null>();
    const [streamContent, setStreamContent] = useState<string>("");

    useEffect(() => {
        setThreadMessages(messages);
        scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sortedMessages = useMemo(() => {
        return messages.sort((a, b) => a.created_at - b.created_at);
    }, [threadMessages]);

    const onMessageReceived = (e: MessageEvent<any>) => {
        const data = JSON.parse(e.data);
        const { action, message, sender, role } = data;

        switch (action) {
            case "start":
                setIncoming(true);
                setStreamedMessage({ id: uuidv4(), action, role, sender });
                setStreamContent("");
                break;
            case "stop":
                const content = [{ type: "text", text: { value: streamContent } }];
                const streamed = { ...streamedMessage, content: content };
                setThreadMessages([...threadMessages, streamed]);
                setIncoming(false);
                break;
            case "body":
                setIncoming(true);
                setStreamContent((prevState) => prevState + message);
                scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
                break;
        }
    };

    useEffect(() => {
        const socket = new WebSocket(`${WEBSOCKET_BASE_URL}/${threadId}?token=${token}`);
        socketRef.current = socket;
        socket.onopen = () => console.log("Socket opened successfully ");
        socket.onerror = (ev) => console.error(ev);
        socket.onclose = (ev) => console.error(ev);
        socket.onmessage = (ev) => {
            onMessageReceived(ev);
        };

        return () => socket.close();
    }, []);

    const content = [{ type: "text", text: { value: streamContent } }];
    const streamed = { ...streamedMessage, content: content };
    return (
        <div className="flex flex-col w-full h-[65vh] overflow-y-scroll">
            <div className="w-full max-w-screen-md mx-auto space-y-12">
                {sortedMessages?.map((message, idx) => <Message {...message} key={idx} />)}
                {incoming ? <Message {...streamed} /> : <div />}
            </div>
            <div ref={scrollRef} />
        </div>
    );
}
