import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loadAssistants() {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth_token");
    if (!authToken) return redirect("/");

    const resp = await fetch("http://localhost:8000/assistants", {
        method: "GET",
        headers: new Headers({ Authorization: `Bearer ${authToken.value}` }),
    });

    if (!resp.ok) return redirect("/");
    const assistants = await resp.json();
    return assistants;
}

import Screen from "./screen";

export default async function Page() {
    const assistants = await loadAssistants();
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth_token");

    return <Screen assistants={assistants} token={authToken?.value} />;
}
