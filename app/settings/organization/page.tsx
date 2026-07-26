import InviteMemberForm from "@/components/organization/InviteMemberForm";
import MembersList from "@/components/organization/MembersList";

export default function OrganizationSettingsPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 space-y-8">

      <div>
        <h1 className="text-3xl font-bold">
          Manage Organization
        </h1>

        <p className="text-muted-foreground">
          Invite and manage members.
        </p>
      </div>

      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          Invite Member
        </h2>

        <InviteMemberForm />
      </div>

      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          Members
        </h2>

        <MembersList />
      </div>

    </div>
  );
}