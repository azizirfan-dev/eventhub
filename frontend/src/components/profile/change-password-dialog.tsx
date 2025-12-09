"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUpdatePassword } from "@/hooks/useProfile";

export function ChangePasswordDialog() {
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
        <Button variant="outline">Change Password</Button>
      </DialogTrigger>

      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
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

        <Button onClick={handleSubmit} disabled={mutation.isPending}>
          Save Changes
        </Button>
      </DialogContent>
    </Dialog>
  );
}
