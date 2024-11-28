/**
 * This is the main page of the application.
 * It contains the login form.
 * It also contains the FastAPI integration logic.
 * 
 */

import { LoginForm } from "@/components/auth/LoginForm";

export default function Page() {
    return (
        <div className="flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-sm space-y-10">
                <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
                    Gainz AI
                </h2>
                <LoginForm />
                <p className="text-center text-sm leading-6 text-gray-500">
                    OpenAI & FastAPI Integration Demo
                </p>
            </div>
        </div>
    );
}
