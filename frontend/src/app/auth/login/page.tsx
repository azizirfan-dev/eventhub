"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/compat/router";



const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginForm = z.infer<typeof LoginSchema>;

export default function LoginPage() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
  });

  const loginUser = useAuthStore((state) => state.login);
  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await api.post("/auth/login", data);

      if (res.data.status === "success") {
        const { token, user } = res.data.data;
        loginUser({ user, token });
        setTimeout(() => {
          if (user.role === "ORGANIZER") {
            window.location.href = "/organizer/dashboard";
          } else {
            window.location.href = "/events";
          }
        }, 10);
      }
    } catch (error: any) {
      alert(error?.response?.data?.message || "Login error");
    }
  };




  return (
    <main className="flex items-center justify-center min-h-screen px-6">
      <div className="bg-zinc-900 p-6 rounded-lg shadow-lg w-full max-w-md space-y-6 border border-zinc-700">
        <h1 className="text-3xl font-bold text-turquoise text-center">Login</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm">Email</label>
            <input
              {...register("email")}
              type="email"
              className="w-full px-3 py-2 rounded bg-black border border-zinc-700 text-white"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">Invalid email</p>
            )}
          </div>

          <div>
            <label className="text-sm">Password</label>
            <input
              {...register("password")}
              type="password"
              className="w-full px-3 py-2 rounded bg-black border border-zinc-700 text-white"
              placeholder="Your password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">Min 6 characters</p>
            )}
          </div>

          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </div>
    </main>
  );
}
