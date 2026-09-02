import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Wallet } from 'lucide-react';
import { getExpenseById } from '../../services/expenses/expense-service';
import { formatDate, formatINR } from '../../utils/format';
import { ExpenseFormModal } from '../../components/expenses/expense-form-modal';
import type { Expense } from '../../types';

export default function ExpenseDetailsPage() {
  const { expenseId } = useParams<{ expenseId: string }>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [localExpOverride, setLocalExpOverride] = useState<Expense | null>(null);

  const baseExpContext = useMemo(() => {
    if (!expenseId) return null;
    return getExpenseById(expenseId);
  }, [expenseId]);

  if (!baseExpContext) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-2xl font-semibold text-navy-900 mb-2">Expense not found</h1>
        <p className="text-slate-500 mb-6">The expense you are looking for does not exist or has been removed.</p>
        <Link to="/expenses" className="flex items-center gap-2 px-4 py-2 bg-navy-900 text-white rounded-md hover:bg-navy-800 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Expenses
        </Link>
      </div>
    );
  }

  // Merge context with local overrides
  const exp = localExpOverride || baseExpContext.expense;
  const { truckName, truckRegistration, dealName } = baseExpContext;

  const handleEditExpense = (updatedData: Partial<Expense>) => {
    setLocalExpOverride({ ...exp, ...updatedData } as Expense);
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <Link to="/expenses" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-navy-900 mb-3 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Expenses
            </Link>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-navy-900 flex items-center gap-2">
                <Wallet className="w-6 h-6 text-slate-400" />
                Expense Details
              </h1>
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                {exp.category}
              </span>
            </div>
            <p className="text-slate-600">{formatDate(exp.date)} • {exp.description}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 text-sm font-medium transition-colors"
            >
              <Edit className="w-4 h-4" /> Edit
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden h-full">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h2 className="text-base font-semibold text-navy-900">Expense Information</h2>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <div className="text-xs text-slate-500 mb-1">Amount</div>
              <div className="text-xl font-bold text-red-600">{formatINR(exp.amount)}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Category</div>
              <div className="text-sm font-medium text-navy-900">{exp.category}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Description</div>
              <div className="text-sm font-medium text-navy-900">{exp.description}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Date</div>
              <div className="text-sm font-medium text-navy-900">{formatDate(exp.date)}</div>
            </div>
            {exp.notes && (
              <div>
                <div className="text-xs text-slate-500 mb-1">Notes</div>
                <div className="text-sm text-slate-700 bg-slate-50 p-3 rounded border border-slate-100">{exp.notes}</div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden h-full">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h2 className="text-base font-semibold text-navy-900">Business Context</h2>
          </div>
          <div className="p-5 space-y-6">
            
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Associated Truck</h3>
              {exp.truckId ? (
                <div className="bg-slate-50 p-3 rounded-md border border-slate-200">
                  <div className="font-medium text-navy-900 mb-1">{truckName || 'Unknown Truck'}</div>
                  <div className="text-xs text-slate-500 mb-2">Registration: {truckRegistration || '-'}</div>
                  <Link to={`/inventory/${exp.truckId}`} className="text-sm font-medium text-navy-600 hover:text-navy-800 hover:underline">
                    View Truck Profile &rarr;
                  </Link>
                </div>
              ) : (
                <div className="text-sm text-slate-500 italic">No truck associated with this expense.</div>
              )}
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Associated Deal</h3>
              {exp.dealId ? (
                <div className="bg-slate-50 p-3 rounded-md border border-slate-200">
                  <div className="font-medium text-navy-900 mb-2">{dealName || `Deal ${exp.dealId}`}</div>
                  <Link to={`/deals/${exp.dealId}`} className="text-sm font-medium text-navy-600 hover:text-navy-800 hover:underline">
                    View Deal Details &rarr;
                  </Link>
                </div>
              ) : (
                <div className="text-sm text-slate-500 italic">No deal associated with this expense.</div>
              )}
            </div>

          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <ExpenseFormModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          onSubmit={handleEditExpense}
          initialData={exp}
        />
      )}
    </div>
  );
}
