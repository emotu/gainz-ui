"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface LoginData {
  username: string;
  password: string;
}

interface ScreenProps {
  assistants: Array<{
    id: string;
    name: string;
    instructions: string;
    model: string;
  }>;
  token: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws';

export async function login(data: LoginData) {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return response.json();
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
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
