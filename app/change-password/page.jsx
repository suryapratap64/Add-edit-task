"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword)
      return toast.error("Please fill all fields");
    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match");
    setLoading(true);
    try {
      const res = await fetch("/api/change-password", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Password changed");
        // Redirect to login page after password change
        setTimeout(() => router.push("/login"), 800);
      } else {
        toast.error(data.message || "Failed to change password");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-full flex h-screen bg-gradient-to-b from-gray-700 via-green-300 to-gray-800 items-center">
      <div className="max-w-lg mx-auto  p-6 shadow-2xl rounded-2xl   bg-black/60  ">
        <h1 className="text-2xl font-bold mb-4">Change Password</h1>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email id</label>
            <input
              type="email"
              value={email}
              className="w-full p-2 rounded border"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Current password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              New password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Confirm new password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {loading ? "Saving..." : "Change password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
