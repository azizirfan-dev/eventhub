// src/components/auth/auth-modal.tsx
"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuthModalStore } from "@/store/auth-modal";
import { useLogin, useRegister } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AuthModal() {
  const router = useRouter();
  const { isOpen, mode, close, switchMode } = useAuthModalStore();
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    referralCode: "",
  });

  const isLogin = mode === "login";

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      alert("Email and password are required.");
      return;
    }

    loginMutation.mutate(loginForm, {
      onSuccess: () => {
        close();
        router.push("/"); 
      },
      onError: (err: any) => {
        const message =
          err?.response?.data?.message || "Login failed. Please check your credentials.";
        alert(message);
      },
    });
  };

  const handleRegisterSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      alert("Name, email, and password are required.");
      return;
    }

    registerMutation.mutate(
      {
        name: registerForm.name,
        email: registerForm.email,
        password: registerForm.password,
        referralCode: registerForm.referralCode || undefined,
      },
      {
        onSuccess: () => {
          close();
          router.push("/"); 
        },
        onError: (err: any) => {
          const message =
            err?.response?.data?.message ||
            "Register failed. Please check your data.";
          alert(message);
        },
      }
    );
  };

  const loading = loginMutation.isPending || registerMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? close() : null)}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-900">
            {isLogin ? "Welcome back" : "Create your EventHub account"}
          </DialogTitle>
        </DialogHeader>

        {isLogin ? (
          <form className="space-y-4 pt-2" onSubmit={handleLoginSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm((prev) => ({ ...prev, password: e.target.value }))
                }
              />
            </div>

            <Button
              type="submit"
              className="mt-2 w-full rounded-full"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Login"}
            </Button>

            <p className="pt-2 text-center text-xs text-slate-500">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                className="font-semibold text-indigo-600 hover:underline"
                onClick={() => switchMode("register")}
              >
                Register now
              </button>
            </p>
          </form>
        ) : (
          <form className="space-y-4 pt-2" onSubmit={handleRegisterSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Name</label>
              <Input
                type="text"
                placeholder="Your full name"
                value={registerForm.name}
                onChange={(e) =>
                  setRegisterForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={registerForm.email}
                onChange={(e) =>
                  setRegisterForm((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={registerForm.password}
                onChange={(e) =>
                  setRegisterForm((prev) => ({ ...prev, password: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Referral Code <span className="text-xs text-slate-400">(optional)</span>
              </label>
              <Input
                type="text"
                placeholder="Referral code (if any)"
                value={registerForm.referralCode}
                onChange={(e) =>
                  setRegisterForm((prev) => ({
                    ...prev,
                    referralCode: e.target.value,
                  }))
                }
              />
            </div>

            <Button
              type="submit"
              className="mt-2 w-full rounded-full"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Register"}
            </Button>

            <p className="pt-2 text-center text-xs text-slate-500">
              Already have an account?{" "}
              <button
                type="button"
                className="font-semibold text-indigo-600 hover:underline"
                onClick={() => switchMode("login")}
              >
                Login
              </button>
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
