import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login } from "@/app/actions";

interface LoginFormData {
  username: string;
  password: string;
}

export function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    await login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="relative -space-y-px rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-0 z-10 rounded-md ring-1 ring-inset ring-gray-300" />
        <FormField
          label="Username"
          error={errors.username}
          {...register("username", { required: "Username is required" })}
        />
        <FormField
          label="Password"
          type="password"
          error={errors.password}
          {...register("password", { required: "Password is required" })}
        />
      </div>
      <Button size="lg" type="submit" className="w-full font-bold">
        Sign in
      </Button>
    </form>
  );
} 