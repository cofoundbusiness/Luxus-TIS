import { PageHeader } from '../../components/layout/page-header';

export default function SalesReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Sales Reports" description="Analyze sales volume and trends." />
      <div className="bg-white rounded-lg border border-slate-200 p-6 min-h-[400px] flex items-center justify-center text-slate-500">
        [ Sales Reports module will be implemented in a future phase ]
      </div>
    </div>
  );
}
