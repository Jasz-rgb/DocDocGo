import InviteMemberForm from "@/components/organization/InviteMemberForm";

export default function OrganizationSettingsPage() {
  return (
    <div className="max-w-xl mx-auto mt-10 space-y-6">
      <h1 className="text-3xl font-bold">
        Organization Settings
      </h1>

      <InviteMemberForm />
    </div>
  );
}