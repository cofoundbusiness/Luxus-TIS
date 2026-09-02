import { PageHeader } from '../../components/layout/page-header';

export default function BusinessSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Business Settings" description="Configure dealership details." />
      <div className="bg-white rounded-lg border border-slate-200 p-6 min-h-[400px] flex items-center justify-center text-slate-500">
        [ Business Settings module will be implemented in a future phase ]
      </div>
    </div>
  );
}
