import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pages = [
  { path: 'dashboard/index.tsx', name: 'Overview', desc: 'Business overview and operational status.' },
  { path: 'inventory/index.tsx', name: 'Inventory', desc: 'Manage and monitor your truck inventory.' },
  { path: 'inventory/new.tsx', name: 'Add Truck', desc: 'Add a new truck to inventory.' },
  { path: 'inventory/detail.tsx', name: 'Truck Details', desc: 'View truck information.' },
  { path: 'inventory/edit.tsx', name: 'Edit Truck', desc: 'Modify truck details.' },
  { path: 'inventory/documents.tsx', name: 'Truck Documents', desc: 'Manage documents for this truck.' },
  { path: 'inventory/expenses.tsx', name: 'Truck Expenses', desc: 'Manage expenses for this truck.' },
  { path: 'inventory/history.tsx', name: 'Truck History', desc: 'View activity history for this truck.' },
  { path: 'leads/index.tsx', name: 'Leads', desc: 'Manage potential customers and enquiries.' },
  { path: 'leads/new.tsx', name: 'New Lead', desc: 'Create a new lead.' },
  { path: 'leads/detail.tsx', name: 'Lead Details', desc: 'View lead information and follow-ups.' },
  { path: 'customers/index.tsx', name: 'Customers', desc: 'Manage customer relationships.' },
  { path: 'customers/detail.tsx', name: 'Customer Details', desc: 'View customer information and history.' },
  { path: 'brokers/index.tsx', name: 'Brokers', desc: 'Manage broker relationships and performance.' },
  { path: 'brokers/new.tsx', name: 'New Broker', desc: 'Add a new broker profile.' },
  { path: 'brokers/detail.tsx', name: 'Broker Details', desc: 'View broker information and commissions.' },
  { path: 'deals/index.tsx', name: 'Deals', desc: 'Manage sales and transactions.' },
  { path: 'deals/new.tsx', name: 'New Deal', desc: 'Create a new deal.' },
  { path: 'deals/detail.tsx', name: 'Deal Details', desc: 'View deal information and status.' },
  { path: 'finance/index.tsx', name: 'Finance Overview', desc: 'Overview of financing operations.' },
  { path: 'finance/loans.tsx', name: 'Loans', desc: 'Manage truck financing and loans.' },
  { path: 'finance/commissions.tsx', name: 'Finance Commissions', desc: 'Track expected and received commissions.' },
  { path: 'finance/partners.tsx', name: 'Finance Partners', desc: 'Manage relationships with finance companies.' },
  { path: 'reports/index.tsx', name: 'Reports', desc: 'Business reporting and analytics.' },
  { path: 'reports/sales.tsx', name: 'Sales Reports', desc: 'Analyze sales volume and trends.' },
  { path: 'reports/inventory.tsx', name: 'Inventory Reports', desc: 'Analyze inventory value and aging.' },
  { path: 'reports/brokers.tsx', name: 'Broker Reports', desc: 'Analyze broker performance.' },
  { path: 'reports/finance.tsx', name: 'Finance Reports', desc: 'Analyze financing and loan performance.' },
  { path: 'reports/profit.tsx', name: 'Profit Reports', desc: 'Analyze business profitability.' },
  { path: 'settings/index.tsx', name: 'Settings', desc: 'System configuration and preferences.' },
  { path: 'settings/users.tsx', name: 'Users', desc: 'Manage system users and access.' },
  { path: 'settings/business.tsx', name: 'Business Settings', desc: 'Configure dealership details.' },
  { path: 'auth/login.tsx', name: 'Login', desc: 'Sign in to LUXUS TiS.', noLayout: true },
  { path: 'auth/forgot-password.tsx', name: 'Forgot Password', desc: 'Recover your account access.', noLayout: true },
  // Extra missing globals for sidebar items
  { path: 'documents/index.tsx', name: 'Documents', desc: 'Global document management.' },
  { path: 'expenses/index.tsx', name: 'Expenses', desc: 'Global expense management.' },
];

pages.forEach(p => {
  const fullPath = path.join(__dirname, 'src', 'pages', p.path);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  
  const depth = p.path.split('/').length - 1;
  const prefix = '../'.repeat(depth + 1);
  const headerImport = `import { PageHeader } from '${prefix}components/layout/page-header';`;
  
  let content = '';
  if (p.noLayout) {
    content = `export default function ${p.name.replace(/[^a-zA-Z]/g, '')}Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-navy-900 mb-2">${p.name}</h1>
        <p className="text-slate-500 mb-6">${p.desc}</p>
        <div className="h-40 flex items-center justify-center text-sm text-slate-400 border-2 border-dashed border-slate-100 rounded">
          [ Form Implementation Pending ]
        </div>
      </div>
    </div>
  );
}`;
  } else {
    content = `${headerImport}

export default function ${p.name.replace(/[^a-zA-Z]/g, '')}Page() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="${p.name}" description="${p.desc}" />
      <div className="bg-white rounded-lg border border-slate-200 p-6 min-h-[400px] flex items-center justify-center text-slate-500">
        [ ${p.name} module will be implemented in a future phase ]
      </div>
    </div>
  );
}
`;
  }
  
  fs.writeFileSync(fullPath, content);
});
console.log('Scaffolded', pages.length, 'pages.');
