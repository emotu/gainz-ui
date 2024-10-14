import { BotIcon, UserIcon } from "lucide-react";
import { cn } from "@app/lib/utils";
import ReactMarkdown from "react-markdown";

export default function Component({
    id,
    role,
    sender,
    content = [],
}: {
    id: string;
    role: string;
    sender: string;
    content: { text: { value: string }; type: string }[];
}) {
    return (
        <div className="space-y-2">
            <p className={cn("text-[10px] uppercase text-zinc-400", role === "user" && "text-right pr-2.5")}>{role}</p>
            <div
                key={id}
                className={cn(
                    "flex flex-row items-start relative",
                    role === "assistant" ? "justify-start" : "justify-end",
                )}>
                <div
                    className={cn(
                        "h-10 w-10 flex justify-center items-center border rounded-full absolute top-2",
                        role === "assistant" ? " -left-16" : " -right-16",
                    )}>
                    {role == "assistant" ? <BotIcon className="h-5 w-5" /> : <UserIcon className="h-5 w-5" />}
                </div>
                <ReactMarkdown
                    className={cn(
                        "",
                        role === "assistant"
                            ? "bg-transparent rounded-none prose text-black w-full max-w-full"
                            : "flex leading-snug w-auto flex-end items-center rounded-xl bg-zinc-100 px-4 py-4",
                    )}>
                    {content[0]?.text?.value || ""}
                </ReactMarkdown>
                <span className="text-xs text-gray-500">{sender}</span>
            </div>
        </div>
    );
}
