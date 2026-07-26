"use client";

import { useState } from "react";

export default function InviteMemberForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function inviteMember(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/organizations/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (Array.isArray(data.error)) {
          setMessage(data.error[0]?.longMessage || data.error[0]?.message);
        } else {
          setMessage(data.error || "Something went wrong");
        }
      }
    } catch {
      setMessage("Failed to send invitation.");
    }

    setLoading(false);
  }

  return (
    <form onSubmit={inviteMember} className="space-y-4">
      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded border p-2"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? "Sending..." : "Invite Member"}
      </button>

      {message && (
        <p className="text-sm">
          {message}
        </p>
      )}
    </form>
  );
}