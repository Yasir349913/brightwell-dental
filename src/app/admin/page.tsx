import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Appointments</h1>
        <p className="mt-1 text-muted">
          Review new requests, confirm times and keep track of today&apos;s diary.
        </p>
      </div>
      <AdminDashboard />
    </>
  );
}