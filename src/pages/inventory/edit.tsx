import { PageHeader } from '../../components/layout/page-header';

export default function EditTruckPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Edit Truck" description="Modify truck details." />
      <div className="bg-white rounded-lg border border-slate-200 p-6 min-h-[400px] flex items-center justify-center text-slate-500">
        [ Edit Truck module will be implemented in a future phase ]
      </div>
    </div>
  );
}
