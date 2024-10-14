"use server";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

export async function login(formData: FormData) {
    const cookieStore = cookies();
    const username = formData.get("username");
    const resp = await fetch("http://localhost:8000/auth/token", {
        method: "POST",
        headers: new Headers({
            "Content-Type": "application/json",
        }),
        body: JSON.stringify({ username }),
    });

    if (!resp.ok) return false;
    const token = await resp.json();

    cookieStore.set({
        name: "auth_token",
        value: token.access_token,
        httpOnly: true,
        path: "/",
    });

    return redirect("/threads");
}

export async function sendMessage(threadId: string | null, formData: FormData) {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth_token");

    const content = formData.get("content");
    const endpoint = threadId ? `http://localhost:8000/threads/${threadId}/messages` : `http://localhost:8000/threads`;
    const resp = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify({ content }),
        headers: new Headers({
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken?.value}`,
        }),
    });

    if (!resp.ok) return false;
    const thread = await resp.json();
    return thread;
}
export async function deleteThread(threadId: string) {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth_token");

    const resp = await fetch(`http://localhost:8000/threads/${threadId}`, {
        method: "DELETE",
        headers: new Headers({
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken?.value}`,
        }),
    });

    if (!resp.ok) return false;
    const status = await resp.json();
    return status;
}
export async function getThreadMessages(id: string) {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth_token");
    if (!authToken) redirect("/");

    const resp = await fetch(`http://localhost:8000/threads/${id}/messages`, {
        method: "GET",
        headers: new Headers({
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken?.value}`,
        }),
    });

    if (!resp.ok) return [];
    const threadMessages = await resp.json();
    return threadMessages?.data || [];
}

export async function createAssistant(formData: FormData) {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth_token");

    const name = formData.get("name");
    const instructions = formData.get("instructions");
    const model = formData.get("model");
    const resp = await fetch(`http://localhost:8000/assistants`, {
        method: "POST",
        body: JSON.stringify({ name, model, description: "", instructions, tools: [] }),
        headers: new Headers({
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken?.value}`,
        }),
    });

    if (!resp.ok) return false;
    const assistant = await resp.json();
    return assistant;
}

export async function updateAssistant(assistantId: string, formData: FormData) {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth_token");

    const name = formData.get("name");
    const instructions = formData.get("instructions");
    const model = formData.get("model");
    const resp = await fetch(`http://localhost:8000/assistants/${assistantId}`, {
        method: "PATCH",
        body: JSON.stringify({ name, model, description: "", instructions, tools: [] }),
        headers: new Headers({
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken?.value}`,
        }),
    });

    if (!resp.ok) return false;
    const assistant = await resp.json();
    return assistant;
}

export async function deleteAssistant(assistantId: string) {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth_token");

    const resp = await fetch(`http://localhost:8000/assistants/${assistantId}`, {
        method: "DELETE",
        headers: new Headers({
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken?.value}`,
        }),
    });

    if (!resp.ok) return false;
    const status = await resp.json();
    return status;
}

export async function getAssistants() {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth_token");
    if (!authToken) redirect("/");

    const resp = await fetch(`http://localhost:8000/assistants`, {
        method: "GET",
        headers: new Headers({
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken?.value}`,
        }),
    });

    if (!resp.ok) return [];
    const assistants = await resp.json();
    return assistants || [];
}

export async function runThread(threadId: string, assistantId: string) {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth_token");

    const resp = await fetch(`http://localhost:8000/threads/${threadId}/run`, {
        method: "POST",
        body: JSON.stringify({ assistant_id: assistantId }),
        headers: new Headers({
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken?.value}`,
        }),
    });

    if (!resp.ok) return false;
    const assistant = await resp.json();
    return assistant;
}
