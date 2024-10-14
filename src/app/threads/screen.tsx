"use client";
import { useEffect, useState } from "react";
import { Button } from "@app/components/ui/button";
import { Textarea } from "@app/components/ui/textarea";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@app/components/ui/dropdown-menu";
import { ChevronUpDownIcon, PlusIcon } from "@heroicons/react/24/outline";
import { BotIcon, CommandIcon } from "lucide-react";
import { SparklesIcon } from "@heroicons/react/24/solid";

import Form from "./_components/AssistantForm";
import Thread from "./_components/ThreadMessages";

import { cn } from "@/lib/utils";
import { getThreadMessages, runThread, sendMessage } from "@/app/actions";
import { useRouter, useSearchParams } from "next/navigation";

export default function Screen({ assistants = [], token }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const threadId = searchParams.get("threadId");

    const [currentAssistant, setCurrentAssistant] = useState<{
        name: string;
        instructions: string;
        model: string;
    } | null>(assistants?.[0] || {});
    const [currentMessage, setCurrentMessage] = useState("");
    const [messages, setMessages] = useState([]);

    const fetchMessages = async (threadId: string | null) => {
        const messages = threadId ? (await getThreadMessages(threadId)) || [] : [];
        setMessages(messages);
    };

    const postMessage = async (formData: FormData) => {
        const resp = await sendMessage(threadId, formData);
        const updatedThreadId = resp?.thread_id || resp?.id;
        if (!threadId) {
            router.push(`/threads?threadId=${updatedThreadId}`);
        } else {
            fetchMessages(threadId);
        }
    };

    useEffect(() => {
        fetchMessages(threadId);
    }, [threadId]);

    return (
        <div className="w-full fixed h-screen">
            <div className="w-full z-20 px-4 h-[60px] bg-zinc-100 border-b border-zinc-200 flex justify-between sticky top-0 items-center">
                <p className="text-xl font-bold tracking-tight">Gainz Assistants</p>
            </div>
            <div className="w-full bg-white h-[calc(100vh-60px)] grid grid-cols-12 divide-x divide-zinc-200">
                <div className="col-span-3 py-4 px-2 h-full">
                    <div className="w-full">
                        <DropdownMenu>
                            <DropdownMenuTrigger className="w-full data-[state=open]:bg-zinc-100 hover:bg-zinc-100 rounded flex justify-between items-center py-2.5 px-4">
                                <div className="font-bold tracking-tight flex flex-row justify-start items-center">
                                    <BotIcon className="h-6 w-6 mr-2" />
                                    <span>{currentAssistant?.name || "Create or select assistant"}</span>
                                </div>
                                <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align={"start"} alignOffset={20} className="w-[400px] text-base">
                                <DropdownMenuItem
                                    className="font-semibold"
                                    onClick={() => setCurrentAssistant({ name: "", instructions: "", model: "" })}>
                                    <PlusIcon strokeWidth={2} className="h-4 w-4 mr-2" /> Create assistant
                                </DropdownMenuItem>
                                {assistants?.length > 0 && <DropdownMenuSeparator />}
                                {assistants.map((assistant, idx) => {
                                    const isSelected = currentAssistant?.id === assistant.id;
                                    return (
                                        <DropdownMenuItem key={idx} onClick={() => setCurrentAssistant(assistant)}>
                                            {isSelected ? (
                                                <SparklesIcon className="h-4 w-4 mr-2" />
                                            ) : (
                                                <span className="h-4 w-4 mr-2" />
                                            )}
                                            <span className={cn(isSelected && "font-bold")}>{assistant.name}</span>
                                        </DropdownMenuItem>
                                    );
                                })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <Form
                        assistant={currentAssistant}
                        onChanged={() => {
                            window?.location.reload();
                        }}
                    />
                </div>
                <div className="col-span-9 h-[calc(100vh-60px)] bg-white space-y-2 flex flex-col justify-between items-start">
                    <div className="w-full">
                        <div className="px-6 py-8 flex items-center justify-between w-full">
                            <div className="flex items-center space-x-2">
                                <p className="text-xs tracking-wide font-bold">THREAD</p>
                                {threadId && <p className={cn("text-xs text-zinc-400")}>{threadId}</p>}
                            </div>
                        </div>
                        <Thread threadId={threadId} token={token} messages={messages} />
                    </div>
                    <div className="p-8 flex flex-col justify-center items-center w-full">
                        <form
                            action={postMessage}
                            onSubmit={() => {
                                setCurrentMessage("");
                                fetchMessages(threadId);
                            }}
                            className="relative block w-full max-w-screen-md mx-auto">
                            <div className="overflow-hidden rounded-xl shadow-sm ring-1 ring-inset ring-zinc-300 focus-within:ring-2 focus-within:ring-black">
                                <Textarea
                                    name="content"
                                    value={currentMessage}
                                    onChange={(e) => setCurrentMessage(e.target.value)}
                                    rows={2}
                                    placeholder="Enter your message..."
                                    className="block w-full resize-none font-medium outline-0 ring-0 shadow-none focus:!outline-transparent focus:!ring-transparent focus:border-transparent border-0 bg-transparent py-4 px-3 text-zinc-900 placeholder:text-zinc-400 sm:leading-6"
                                />

                                {/* Spacer element to match the height of the toolbar */}
                                <div aria-hidden="true" className="py-2">
                                    {/* Matches height of button in toolbar (1px border + 36px content height) */}
                                    <div className="py-px">
                                        <div className="h-6" />
                                    </div>
                                </div>
                            </div>

                            <div className="absolute inset-x-0 bottom-0 flex justify-between py-3 pl-3 pr-3">
                                <div className="flex items-center space-x-5"></div>
                                <div className="flex-shrink-0 space-x-1.5">
                                    <Button disabled={!currentMessage} type={"submit"} className="font-semibold">
                                        Send
                                    </Button>
                                    <Button
                                        disabled={!threadId}
                                        type={"button"}
                                        onClick={() => runThread(threadId, currentAssistant?.id)}
                                        className="font-semibold space-x-2 bg-green-600">
                                        <span>Run</span> <CommandIcon className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
