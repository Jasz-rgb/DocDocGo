"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

interface Member {
  id: string;
  role: string;
  publicUserData: {
    firstName: string | null;
    lastName: string | null;
    identifier: string;
    imageUrl: string;
    userId: string;
  };
}

export default function MembersList() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  useEffect(() => {
    async function fetchMembers() {
      const res = await fetch("/api/organizations/members");
      const data = await res.json();
      setMembers(data);
      setLoading(false);
    }

    fetchMembers();
  }, []);

  if (loading) {
    return <p>Loading members...</p>;
  }

  return (
    <div className="space-y-4">
      {members.map((member) => (
        <div
          key={member.id}
          className="flex items-center justify-between rounded-lg border p-4"
        >
          <div className="flex items-center gap-3">
            <img
              src={member.publicUserData.imageUrl}
              alt=""
              className="w-10 h-10 rounded-full"
            />

            <div>
              <p className="font-medium">
                {member.publicUserData.firstName}{" "}
                {member.publicUserData.lastName}
              </p>

              <p className="text-sm text-gray-500">
                {member.publicUserData.identifier}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded bg-gray-100 px-3 py-1 text-sm">
              {member.role.replace("org:", "")}
            </span>

            {member.publicUserData.userId !== user?.id &&
              member.role !== "org:owner" && (
                <button
                  onClick={async () => {
                    if (!confirm("Remove this member?")) return;

                    const res=await fetch(
                      `/api/organizations/members/${member.publicUserData.userId}`,
                      {
                        method: "DELETE",
                      }
                    );

                    if (res.ok) {
                      setMembers((prev) =>
                        prev.filter((m) => m.id !== member.id)
                      );
                    } else {
                      alert("Failed to remove member.");
                    }
                  }}
                  className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                >
                  Remove
                </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}