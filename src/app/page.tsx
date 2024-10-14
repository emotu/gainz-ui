/*
  This example requires some changes to your config:

  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login } from "@/app/actions";

export default function Page() {
    return (
        <>
            {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}
            <div className="flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-sm space-y-10">
                    <div>
                        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                            Gainz AI
                        </h2>
                    </div>
                    <form action={login} method="POST" className="space-y-6">
                        <div className="relative -space-y-px rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-0 z-10 rounded-md ring-1 ring-inset ring-gray-300" />
                            <div>
                                <label htmlFor="email-address" className="sr-only">
                                    Email address
                                </label>
                                <Input
                                    id="email-address"
                                    name="username"
                                    required
                                    placeholder="Username"
                                    className="relative block w-full h-10 focus:z-10 focus:border-black focus:ring-2 focus:ring-black sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div>
                            <Button size={"lg"} type="submit" className="w-full font-bold">
                                Sign in
                            </Button>
                        </div>
                    </form>

                    <p className="text-center text-sm leading-6 text-gray-500">OpenAI & FastAPI Integration Demo</p>
                </div>
            </div>
        </>
    );
}
