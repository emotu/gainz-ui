import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import DeleteAlert from "./DeleteAlert";

import { createAssistant, deleteAssistant, updateAssistant } from "@/app/actions";

export default function Component({ assistant = {}, onChanged }) {
    const [formValues, setFormValues] = useState(assistant);

    useEffect(() => {
        setFormValues(assistant);
        console.log(assistant);
    }, [assistant]);

    const assistantForm = async (formData: FormData) => {
        if (assistant?.id) {
            await updateAssistant(assistant.id, formData);
        } else {
            await createAssistant(formData);
        }
        onChanged?.();
    };

    const deleteAction = async () => {
        await deleteAssistant(assistant.id);
        onChanged?.();
    };

    return (
        <form action={assistantForm} className="w-full h-[90vh] flex flex-1 flex-col justify-between items-center">
            <div className="w-full p-4 space-y-6">
                <div className="w-full space-y-0.5">
                    <Label className="font-bold text-[11px] uppercase">Name</Label>
                    <Input
                        name="name"
                        value={formValues?.name || ""}
                        onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                        placeholder="Enter a user friendly name"
                        className="bg-white resize-none focus:border-black data-[valid]:font-bold placeholder:text-gray-500"
                    />
                    <span className="text-xs text-gray-500">{formValues?.id}</span>
                </div>
                <div className="w-full overflow-visible space-y-0.5">
                    <Label className="font-bold text-[11px] uppercase">System Instructions</Label>
                    <Textarea
                        placeholder="You are a helpful assistant..."
                        className="bg-white resize-none focus:border-black placeholder:text-gray-500 leading-relaxed"
                        rows={12}
                        value={formValues?.instructions || ""}
                        onChange={(e) => setFormValues({ ...formValues, instructions: e.target.value })}
                        name="instructions"
                    />
                </div>
                <div className="w-full space-y-0.5">
                    <Label className="font-bold text-[11px] uppercase">Model</Label>
                    <Select
                        name="model"
                        defaultValue={formValues?.model}
                        value={formValues?.model}
                        onValueChange={(value) => setFormValues({ ...formValues, model: value })}>
                        <SelectTrigger className="bg-white w-full font-bold focus:ring-1 focus:border-black focus:outline-1 data-[placeholder]:font-normal data-[placeholder]:text-gray-500">
                            <SelectValue className="bg-white" placeholder="Select a chat model" />
                        </SelectTrigger>
                        <SelectContent className="text-gray-500 font-medium">
                            <SelectGroup>
                                <SelectLabel className="text-xs text-black uppercase">CHAT</SelectLabel>
                                <SelectItem value="gpt-4o-mini">gpt-4o-mini</SelectItem>
                                <SelectItem value="gpt-3.5-turbo">gpt-3.5-turbo</SelectItem>
                                <SelectItem value="gpt-3.5-turbo-16k">gpt-3.5-turbo-16k</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="w-full p-4 flex-shrink-0 py-12 flex flex-row justify-between items-center">
                <div className="flex flex-row space-x-2">
                    <Button type={"submit"} className="font-bold bg-gray-200" variant="secondary">
                        {assistant.id ? "Update" : "English"}
                    </Button>
                    {assistant?.id && (
                        <DeleteAlert onAction={() => deleteAction()}>
                            <Button type={"button"} className="font-bold bg-gray-200" variant="secondary" size="icon">
                                <TrashIcon className="h-4 w-4" strokeWidth={2} />
                            </Button>
                        </DeleteAlert>
                    )}
                </div>
                <div className="text-gray-500 text-xs">Updated Oct 12, 2024, 8:06PM</div>
            </div>
        </form>
    );
}
