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

import AccessDeniedPage from '../pages/auth/access-denied';
import { ProtectedRoute } from '../components/auth/protected-route';

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
    path: '/403',
    element: <AccessDeniedPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RootLayout />,
        children: [
          {
            path: '/dashboard',
            element: <DashboardPage />,
          },
          // Inventory
          { path: '/inventory', element: <ProtectedRoute requiredPermission="inventory.view" />, children: [{ index: true, element: <InventoryPage /> }] },
          { path: '/inventory/new', element: <ProtectedRoute requiredPermission="inventory.create" />, children: [{ index: true, element: <AddTruckPage /> }] },
          { path: '/inventory/:truckId', element: <ProtectedRoute requiredPermission="inventory.view" />, children: [{ index: true, element: <TruckDetailsPage /> }] },
          { path: '/inventory/:truckId/edit', element: <ProtectedRoute requiredPermission="inventory.edit" />, children: [{ index: true, element: <EditTruckPage /> }] },
          { path: '/inventory/:truckId/documents', element: <ProtectedRoute requiredPermission="documents.view" />, children: [{ index: true, element: <TruckDocumentsPage /> }] },
          { path: '/inventory/:truckId/expenses', element: <ProtectedRoute requiredPermission="expenses.view" />, children: [{ index: true, element: <TruckExpensesPage /> }] },
          { path: '/inventory/:truckId/history', element: <ProtectedRoute requiredPermission="inventory.view" />, children: [{ index: true, element: <TruckHistoryPage /> }] },
          
          // Global placeholders
          { path: '/documents', element: <ProtectedRoute requiredPermission="documents.view" />, children: [{ index: true, element: <GlobalDocumentsPage /> }] },
          { path: '/documents/:documentId', element: <ProtectedRoute requiredPermission="documents.view" />, children: [{ index: true, element: <DocumentDetailsPage /> }] },
          { path: '/expenses', element: <ProtectedRoute requiredPermission="expenses.view" />, children: [{ index: true, element: <GlobalExpensesPage /> }] },
          { path: '/expenses/:expenseId', element: <ProtectedRoute requiredPermission="expenses.view" />, children: [{ index: true, element: <ExpenseDetailsPage /> }] },

          // Leads
          { path: '/leads', element: <ProtectedRoute requiredPermission="leads.view" />, children: [{ index: true, element: <LeadsPage /> }] },
          { path: '/leads/new', element: <ProtectedRoute requiredPermission="leads.create" />, children: [{ index: true, element: <NewLeadPage /> }] },
          { path: '/leads/:leadId', element: <ProtectedRoute requiredPermission="leads.view" />, children: [{ index: true, element: <LeadDetailsPage /> }] },

          // Customers
          { path: '/customers', element: <ProtectedRoute requiredPermission="customers.view" />, children: [{ index: true, element: <CustomersPage /> }] },
          { path: '/customers/:customerId', element: <ProtectedRoute requiredPermission="customers.view" />, children: [{ index: true, element: <CustomerDetailsPage /> }] },

          // Brokers
          { path: '/brokers', element: <ProtectedRoute requiredPermission="brokers.view" />, children: [{ index: true, element: <BrokersPage /> }] },
          { path: '/brokers/new', element: <ProtectedRoute requiredPermission="brokers.create" />, children: [{ index: true, element: <NewBrokerPage /> }] },
          { path: '/brokers/:brokerId', element: <ProtectedRoute requiredPermission="brokers.view" />, children: [{ index: true, element: <BrokerDetailsPage /> }] },

          // Deals
          { path: '/deals', element: <ProtectedRoute requiredPermission="deals.view" />, children: [{ index: true, element: <DealsPage /> }] },
          { path: '/deals/new', element: <ProtectedRoute requiredPermission="deals.create" />, children: [{ index: true, element: <NewDealPage /> }] },
          { path: '/deals/:dealId', element: <ProtectedRoute requiredPermission="deals.view" />, children: [{ index: true, element: <DealDetailsPage /> }] },

          // Finance (Loans, Commissions, Partners)
          { path: '/finance', element: <ProtectedRoute requiredPermission="deals.view" />, children: [{ index: true, element: <FinanceOverviewPage /> }] },
          { path: '/loans', element: <ProtectedRoute requiredPermission="loans.view" />, children: [{ index: true, element: <LoansPage /> }] },
          { path: '/loans/:loanId', element: <ProtectedRoute requiredPermission="loans.view" />, children: [{ index: true, element: <LoanDetailsPage /> }] },
          { path: '/commissions', element: <ProtectedRoute requiredPermission="commissions.view" />, children: [{ index: true, element: <CommissionsPage /> }] },
          { path: '/commissions/:commissionId', element: <ProtectedRoute requiredPermission="commissions.view" />, children: [{ index: true, element: <CommissionDetailsPage /> }] },
          { path: '/finance-partners', element: <ProtectedRoute requiredPermission="finance_partners.view" />, children: [{ index: true, element: <PartnersPage /> }] },
          { path: '/finance-partners/:financePartnerId', element: <ProtectedRoute requiredPermission="finance_partners.view" />, children: [{ index: true, element: <PartnerDetailsPage /> }] },
          
          // Old finance route redirects just in case any internal links use them
          { path: '/finance/loans', element: <Navigate to="/loans" replace /> },
          { path: '/finance/commissions', element: <Navigate to="/commissions" replace /> },
          { path: '/finance/partners', element: <Navigate to="/finance-partners" replace /> },

          // Reports & Insights
          { path: '/reports', element: <ProtectedRoute requiredPermission="reports.view" />, children: [{ index: true, element: <ReportsPage /> }] },
          { path: '/insights', element: <ProtectedRoute requiredPermission="insights.view" />, children: [{ index: true, element: <InsightsPage /> }] },

          // Old report routes redirect to main reports tab for safety
          { path: '/reports/sales', element: <Navigate to="/reports?tab=sales" replace /> },
          { path: '/reports/inventory', element: <Navigate to="/reports?tab=inventory" replace /> },
          { path: '/reports/brokers', element: <Navigate to="/reports?tab=brokers" replace /> },
          { path: '/reports/finance', element: <Navigate to="/reports?tab=finance" replace /> },
          { path: '/reports/profit', element: <Navigate to="/reports?tab=sales" replace /> },

          // Settings
          { path: '/settings', element: <ProtectedRoute requiredPermission="settings.view" />, children: [{ index: true, element: <SettingsPage /> }] },
          { path: '/settings/users', element: <ProtectedRoute requiredPermission="users.view" />, children: [{ index: true, element: <UsersPage /> }] },
          { path: '/settings/business', element: <ProtectedRoute requiredPermission="settings.edit" />, children: [{ index: true, element: <BusinessSettingsPage /> }] },

          // 404 inside layout
          { path: '/404notfound', element: <NotFoundPage /> },
          { path: '*', element: <NotFoundPage /> },
        ]
      }
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  }
]);
