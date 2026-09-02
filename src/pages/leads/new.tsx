import { PageHeader } from '../../components/layout/page-header';

export default function NewLeadPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="New Lead" description="Create a new lead." />
      <div className="bg-white rounded-lg border border-slate-200 p-6 min-h-[400px] flex items-center justify-center text-slate-500">
        [ New Lead module will be implemented in a future phase ]
      </div>
    </div>
  );
}
