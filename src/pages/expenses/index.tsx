import { useState, useMemo } from 'react';
import { PageHeader } from '../../components/layout/page-header';
import { ExpenseSummary } from '../../components/expenses/expense-summary';
import { ExpenseCategoryBreakdown } from '../../components/expenses/expense-category-breakdown';
import { ExpenseFilters } from '../../components/expenses/expense-filters';
import type { ExpenseFilterState } from '../../components/expenses/expense-filters';
import { ExpenseTable } from '../../components/expenses/expense-table';
import { getExpenseSummary, searchExpenses, getExpensesByCategory } from '../../services/expenses/expense-service';
import { expenses as mockExpenses } from '../../data/mock';
import { Plus } from 'lucide-react';
import { ExpenseFormModal } from '../../components/expenses/expense-form-modal';
import type { Expense } from '../../types';

export default function ExpensesPage() {
  const [expenseList, setExpenseList] = useState<Expense[]>(mockExpenses);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ExpenseFilterState>({
    category: 'All',
    truckId: 'All'
  });

  const summary = useMemo(() => getExpenseSummary(expenseList), [expenseList]);
  const breakdown = useMemo(() => getExpensesByCategory(expenseList), [expenseList]);
  const filteredExpenses = useMemo(() => searchExpenses(expenseList, searchQuery, filters), [expenseList, searchQuery, filters]);

  const handleAddExpense = (newExpData: Partial<Expense>) => {
    const newExp: Expense = {
      ...newExpData,
      id: `EXP-${Date.now()}`,
    } as Expense;
    
    setExpenseList([newExp, ...expenseList]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Expenses" 
        description="Track operational costs associated with inventory and deals."
        actions={
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-navy-900 text-white px-4 py-2 rounded-md hover:bg-navy-800 transition-colors text-sm font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Expense
          </button>
        }
      />

      <ExpenseSummary summary={summary} />
      
      <ExpenseCategoryBreakdown breakdown={breakdown} />

      <ExpenseFilters 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onFilterChange={setFilters}
      />

      <ExpenseTable expenses={filteredExpenses} />

      {isAddModalOpen && (
        <ExpenseFormModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          onSubmit={handleAddExpense} 
        />
      )}
    </div>
  );
}
