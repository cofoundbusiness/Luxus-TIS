import { PageHeader } from '../../components/layout/page-header';

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Users" description="Manage system users and access." />
      <div className="bg-white rounded-lg border border-slate-200 p-6 min-h-[400px] flex items-center justify-center text-slate-500">
        [ Users module will be implemented in a future phase ]
      </div>
    </div>
  );
}
