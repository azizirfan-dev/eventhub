"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";

const RegisterSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

type RegisterForm = z.infer<typeof RegisterSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const loginUser = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      const res = await api.post("/auth/register", data);

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
      } else {
        alert(res.data.message);
      }
    } catch (error: any) {
      alert(error?.response?.data?.message || "Register failed");
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen px-6">
      <div className="bg-zinc-900 p-6 rounded-lg shadow-lg w-full max-w-md space-y-6 border border-zinc-700">
        <h1 className="text-3xl font-bold text-turquoise text-center">Register</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm">Name</label>
            <input
              {...register("name")}
              className="w-full px-3 py-2 rounded bg-black border border-zinc-700 text-white"
              placeholder="Your name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">Name must be at least 3 chars</p>
            )}
          </div>

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
              placeholder="Min 6 characters"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">Min 6 characters</p>
            )}
          </div>

          <Button type="submit" className="w-full">
            Register
          </Button>
        </form>
      </div>
    </main>
  );
}
