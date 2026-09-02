import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RootLayout } from '../components/layout/root-layout';

// Pages
import DashboardPage from '../pages/dashboard/index';

import InventoryPage from '../pages/inventory/index';
import AddTruckPage from '../pages/inventory/new';
import TruckDetailsPage from '../pages/inventory/detail';
import EditTruckPage from '../pages/inventory/edit';
import TruckDocumentsPage from '../pages/inventory/documents';
import TruckExpensesPage from '../pages/inventory/expenses';
import TruckHistoryPage from '../pages/inventory/history';

import GlobalDocumentsPage from '../pages/documents/index';
import DocumentDetailsPage from '../pages/documents/detail';
import GlobalExpensesPage from '../pages/expenses/index';
import ExpenseDetailsPage from '../pages/expenses/detail';

import LeadsPage from '../pages/leads/index';
import NewLeadPage from '../pages/leads/new';
import LeadDetailsPage from '../pages/leads/detail';

import CustomersPage from '../pages/customers/index';
import CustomerDetailsPage from '../pages/customers/detail';

import BrokersPage from '../pages/brokers/index';
import NewBrokerPage from '../pages/brokers/new';
import BrokerDetailsPage from '../pages/brokers/detail';

import DealsPage from '../pages/deals/index';
import NewDealPage from '../pages/deals/new';
import DealDetailsPage from '../pages/deals/detail';

import FinanceOverviewPage from '../pages/finance/index';
import LoansPage from '../pages/loans/index';
import LoanDetailsPage from '../pages/loans/detail';
import CommissionsPage from '../pages/commissions/index';
import CommissionDetailsPage from '../pages/commissions/detail';
import PartnersPage from '../pages/finance-partners/index';
import PartnerDetailsPage from '../pages/finance-partners/detail';

import ReportsPage from '../pages/reports/index';
import InsightsPage from '../pages/insights/index';
import NotFoundPage from '../pages/not-found/index';

import SettingsPage from '../pages/settings/index';
import UsersPage from '../pages/settings/users';
import BusinessSettingsPage from '../pages/settings/business';

import LoginPage from '../pages/auth/login';
import ForgotPasswordPage from '../pages/auth/forgot-password';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/auth/login',
    element: <LoginPage />,
  },
  {
    path: '/auth/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    element: <RootLayout />,
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      // Inventory
      { path: '/inventory', element: <InventoryPage /> },
      { path: '/inventory/new', element: <AddTruckPage /> },
      { path: '/inventory/:truckId', element: <TruckDetailsPage /> },
      { path: '/inventory/:truckId/edit', element: <EditTruckPage /> },
      { path: '/inventory/:truckId/documents', element: <TruckDocumentsPage /> },
      { path: '/inventory/:truckId/expenses', element: <TruckExpensesPage /> },
      { path: '/inventory/:truckId/history', element: <TruckHistoryPage /> },
      
      // Global placeholders
      { path: '/documents', element: <GlobalDocumentsPage /> },
      { path: '/documents/:documentId', element: <DocumentDetailsPage /> },
      { path: '/expenses', element: <GlobalExpensesPage /> },
      { path: '/expenses/:expenseId', element: <ExpenseDetailsPage /> },

      // Leads
      { path: '/leads', element: <LeadsPage /> },
      { path: '/leads/new', element: <NewLeadPage /> },
      { path: '/leads/:leadId', element: <LeadDetailsPage /> },

      // Customers
      { path: '/customers', element: <CustomersPage /> },
      { path: '/customers/:customerId', element: <CustomerDetailsPage /> },

      // Brokers
      { path: '/brokers', element: <BrokersPage /> },
      { path: '/brokers/new', element: <NewBrokerPage /> },
      { path: '/brokers/:brokerId', element: <BrokerDetailsPage /> },

      // Deals
      { path: '/deals', element: <DealsPage /> },
      { path: '/deals/new', element: <NewDealPage /> },
      { path: '/deals/:dealId', element: <DealDetailsPage /> },

      // Finance (Loans, Commissions, Partners)
      { path: '/finance', element: <FinanceOverviewPage /> }, // Old overview placeholder, left intact
      { path: '/loans', element: <LoansPage /> },
      { path: '/loans/:loanId', element: <LoanDetailsPage /> },
      { path: '/commissions', element: <CommissionsPage /> },
      { path: '/commissions/:commissionId', element: <CommissionDetailsPage /> },
      { path: '/finance-partners', element: <PartnersPage /> },
      { path: '/finance-partners/:financePartnerId', element: <PartnerDetailsPage /> },
      
      // Old finance route redirects just in case any internal links use them
      { path: '/finance/loans', element: <Navigate to="/loans" replace /> },
      { path: '/finance/commissions', element: <Navigate to="/commissions" replace /> },
      { path: '/finance/partners', element: <Navigate to="/finance-partners" replace /> },

      // Reports & Insights
      { path: '/reports', element: <ReportsPage /> },
      { path: '/insights', element: <InsightsPage /> },

      // Old report routes redirect to main reports tab for safety
      { path: '/reports/sales', element: <Navigate to="/reports?tab=sales" replace /> },
      { path: '/reports/inventory', element: <Navigate to="/reports?tab=inventory" replace /> },
      { path: '/reports/brokers', element: <Navigate to="/reports?tab=brokers" replace /> },
      { path: '/reports/finance', element: <Navigate to="/reports?tab=finance" replace /> },
      { path: '/reports/profit', element: <Navigate to="/reports?tab=sales" replace /> },

      // Settings
      { path: '/settings', element: <SettingsPage /> },
      { path: '/settings/users', element: <UsersPage /> },
      { path: '/settings/business', element: <BusinessSettingsPage /> },

      // 404 Pages
      { path: '/404notfound', element: <NotFoundPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
