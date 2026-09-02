import { useState, useMemo } from 'react';
import { PageHeader } from '../../components/layout/page-header';
import { LoanSummary } from '../../components/loans/loan-summary';
import { LoanFilters } from '../../components/loans/loan-filters';
import type { LoanFilterState } from '../../components/loans/loan-filters';
import { LoanTable } from '../../components/loans/loan-table';
import { getLoanContext, getLoanSummary, searchLoans } from '../../services/loans/loan-service';
import { loans as mockLoans, financePartners } from '../../data/mock';
import { Plus } from 'lucide-react';
import { LoanFormModal } from '../../components/loans/loan-form-modal';
import type { Loan } from '../../types';

export default function LoansPage() {
  const [loanList, setLoanList] = useState<Loan[]>(mockLoans);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<LoanFilterState>({
    status: 'All',
    financePartnerId: 'All'
  });

  const contexts = useMemo(() => loanList.map(getLoanContext), [loanList]);
  const summary = useMemo(() => getLoanSummary(contexts), [contexts]);
  
  const filteredLoans = useMemo(() => 
    searchLoans(contexts, searchQuery, filters), 
    [contexts, searchQuery, filters]
  );

  const handleAddLoan = (newLoanData: Partial<Loan>) => {
    const newLoan: Loan = {
      ...newLoanData,
      id: `LN-${Math.floor(1000 + Math.random() * 9000)}`,
      receivedCommission: 0 // New loan won't have received commission yet
    } as Loan;
    
    setLoanList([newLoan, ...loanList]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Loans" 
        description="Track customer financing applications, approvals, disbursements and finance commissions."
        actions={
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-navy-900 text-white px-4 py-2 rounded-md hover:bg-navy-800 transition-colors text-sm font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Loan
          </button>
        }
      />

      <LoanSummary summary={summary} />

      <LoanFilters 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onFilterChange={setFilters}
        financePartners={financePartners}
      />

      <LoanTable loans={filteredLoans} />

      {isAddModalOpen && (
        <LoanFormModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          onSubmit={handleAddLoan} 
        />
      )}
    </div>
  );
}
