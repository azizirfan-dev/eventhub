// src/components/profile/sections/change-password-modal.tsx
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUpdatePassword } from "@/hooks/useProfile";

export default function ChangePasswordModal() {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");

  const mutation = useUpdatePassword();

  const handleSubmit = () => {
    mutation.mutate(
      { oldPass, newPass },
      {
        onSuccess: () => {
          alert("Password updated!");
          setOldPass("");
          setNewPass("");
        },
        onError: () => alert("Failed update password"),
      }
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="text-xs rounded-full"
        >
          Change Password
        </Button>
      </DialogTrigger>

      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle className="text-sm">Change Password</DialogTitle>
        </DialogHeader>

        <Input
          type="password"
          value={oldPass}
          placeholder="Old Password"
          onChange={(e) => setOldPass(e.target.value)}
        />
        <Input
          type="password"
          value={newPass}
          placeholder="New Password"
          onChange={(e) => setNewPass(e.target.value)}
        />

        <Button
          onClick={handleSubmit}
          disabled={mutation.isPending}
          className="w-full bg-indigo-600 text-white"
        >
          {mutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
