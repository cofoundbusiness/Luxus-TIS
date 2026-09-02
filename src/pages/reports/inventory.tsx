import { PageHeader } from '../../components/layout/page-header';

export default function InventoryReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Inventory Reports" description="Analyze inventory value and aging." />
      <div className="bg-white rounded-lg border border-slate-200 p-6 min-h-[400px] flex items-center justify-center text-slate-500">
        [ Inventory Reports module will be implemented in a future phase ]
      </div>
    </div>
  );
}
