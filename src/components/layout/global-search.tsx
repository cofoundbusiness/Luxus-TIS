import React, { useState, useEffect, useRef, useMemo, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Truck, Users, Contact, Briefcase, Handshake, Landmark, X, FileText, Receipt, Banknote, Building } from 'lucide-react';
import { cn } from '../../utils/cn';

import { trucks, customers, brokers, leads, deals, loans, financePartners, commissions, expenses, documents } from '../../data/mock';

type EntityType = 'truck' | 'customer' | 'broker' | 'lead' | 'deal' | 'loan' | 'financePartner' | 'commission' | 'expense' | 'document' | 'viewAll';

interface SearchResult {
  id: string;
  type: EntityType;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  url: string;
  isViewAll?: boolean;
}

interface SearchGroup {
  label: string;
  items: SearchResult[];
}

const CATEGORY_KEYWORDS: Record<string, string> = {
  truck: 'truck', trucks: 'truck',
  customer: 'customer', customers: 'customer',
  broker: 'broker', brokers: 'broker',
  lead: 'lead', leads: 'lead',
  deal: 'deal', deals: 'deal',
  loan: 'loan', loans: 'loan',
  finance: 'financePartner', 'finance partner': 'financePartner', 'finance partners': 'financePartner',
  commission: 'commission', commissions: 'commission',
  expense: 'expense', expenses: 'expense',
  document: 'document', documents: 'document'
};

export function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim().toLowerCase());
    }, 150);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const results = useMemo(() => {
    if (!debouncedQuery) return [];

    const q = debouncedQuery;
    const matchedCategory = CATEGORY_KEYWORDS[q];
    const match = (str?: string | null | number) => String(str || '').toLowerCase().includes(q);
    const formatINR = new Intl.NumberFormat('en-IN');

    const groups: SearchGroup[] = [];

    // Helper to generate View All item
    const createViewAll = (label: string, url: string): SearchResult => ({
      id: `view-all-${label.toLowerCase()}`,
      type: 'viewAll',
      title: `View all ${label.toLowerCase()} →`,
      subtitle: '',
      icon: Search,
      url,
      isViewAll: true
    });

    if (matchedCategory) {
      // EXACT CATEGORY SEARCH
      const maxResults = 8;
      if (matchedCategory === 'truck') {
        const items = trucks.slice(0, maxResults).map((t: any) => ({
          id: t.id, type: 'truck' as EntityType, title: `${t.manufacturer} ${t.model} ${t.variant}`.trim(), subtitle: `${t.registrationNumber} · ${t.status}`, icon: Truck, url: `/inventory/${t.id}`
        }));
        items.push(createViewAll('Trucks', '/inventory'));
        groups.push({ label: 'Trucks', items });
      } else if (matchedCategory === 'customer') {
        const items = customers.slice(0, maxResults).map((c: any) => ({
          id: c.id, type: 'customer' as EntityType, title: c.companyName ? `${c.name} · ${c.companyName}` : c.name, subtitle: `${c.phone} · ${c.city}`, icon: Users, url: `/customers/${c.id}`
        }));
        items.push(createViewAll('Customers', '/customers'));
        groups.push({ label: 'Customers', items });
      } else if (matchedCategory === 'broker') {
        const items = brokers.slice(0, maxResults).map((b: any) => ({
          id: b.id, type: 'broker' as EntityType, title: b.companyName ? `${b.name} · ${b.companyName}` : b.name, subtitle: `${b.phone} · ${b.city}`, icon: Briefcase, url: `/brokers/${b.id}`
        }));
        items.push(createViewAll('Brokers', '/brokers'));
        groups.push({ label: 'Brokers', items });
      } else if (matchedCategory === 'lead') {
        const items = leads.slice(0, maxResults).map((l: any) => ({
          id: l.id, type: 'lead' as EntityType, title: `${l.id} — ${(l.requirement && l.requirement.length > 30 ? l.requirement.substring(0, 30) + '...' : l.requirement) || 'N/A'}`, subtitle: `${l.source} · ${l.status}`, icon: Contact, url: `/leads/${l.id}`
        }));
        items.push(createViewAll('Leads', '/leads'));
        groups.push({ label: 'Leads', items });
      } else if (matchedCategory === 'deal') {
        const items = deals.slice(0, maxResults).map((d: any) => {
          const truck = trucks.find((t: any) => t.id === d.truckId);
          const customer = customers.find((c: any) => c.id === d.customerId);
          return { id: d.id, type: 'deal' as EntityType, title: d.id, subtitle: `${truck?.registrationNumber || 'Unknown'} · ${customer?.name || 'Unknown'} · ${d.status}`, icon: Handshake, url: `/deals/${d.id}` };
        });
        items.push(createViewAll('Deals', '/deals'));
        groups.push({ label: 'Deals', items });
      } else if (matchedCategory === 'loan') {
        const items = loans.slice(0, maxResults).map((l: any) => ({
          id: l.id, type: 'loan' as EntityType, title: l.id, subtitle: `₹${formatINR.format(l.loanAmount || 0)} · ${l.status}`, icon: Landmark, url: `/loans/${l.id}`
        }));
        items.push(createViewAll('Loans', '/loans'));
        groups.push({ label: 'Loans', items });
      } else if (matchedCategory === 'financePartner') {
        const items = financePartners.slice(0, maxResults).map((fp: any) => ({
          id: fp.id, type: 'financePartner' as EntityType, title: fp.name, subtitle: `${fp.type} · ${fp.city}`, icon: Building, url: `/finance-partners/${fp.id}`
        }));
        items.push(createViewAll('Finance Partners', '/finance-partners'));
        groups.push({ label: 'Finance Partners', items });
      } else if (matchedCategory === 'commission') {
        const items = commissions.slice(0, maxResults).map((c: any) => ({
          id: c.id, type: 'commission' as EntityType, title: c.id, subtitle: `${c.type} · ₹${formatINR.format(c.amount || 0)} · ${c.status}`, icon: Banknote, url: `/commissions/${c.id}`
        }));
        items.push(createViewAll('Commissions', '/commissions'));
        groups.push({ label: 'Commissions', items });
      } else if (matchedCategory === 'expense') {
        const items = expenses.slice(0, maxResults).map((e: any) => ({
          id: e.id, type: 'expense' as EntityType, title: e.description || e.id, subtitle: `${e.category} · ₹${formatINR.format(e.amount || 0)} · ${e.status}`, icon: Receipt, url: `/expenses/${e.id}`
        }));
        items.push(createViewAll('Expenses', '/expenses'));
        groups.push({ label: 'Expenses', items });
      } else if (matchedCategory === 'document') {
        const items = documents.slice(0, maxResults).map((doc: any) => ({
          id: doc.id, type: 'document' as EntityType, title: doc.title, subtitle: `${doc.documentType} · ${doc.status}`, icon: FileText, url: `/documents/${doc.id}`
        }));
        items.push(createViewAll('Documents', '/documents'));
        groups.push({ label: 'Documents', items });
      }
    } else {
      // NORMAL FUZZY SEARCH (Multi-entity)
      const matchedTrucks = trucks.filter((t: any) => match(t.id) || match(t.registrationNumber) || match(t.manufacturer) || match(t.model) || match(t.variant) || match(t.chassisNumber)).slice(0, 3)
        .map((t: any) => ({ id: t.id, type: 'truck' as EntityType, title: `${t.manufacturer} ${t.model} ${t.variant}`.trim(), subtitle: `${t.registrationNumber} · ${t.status}`, icon: Truck, url: `/inventory/${t.id}` }));
      
      const matchedCustomers = customers.filter((c: any) => match(c.id) || match(c.name) || match(c.companyName) || match(c.phone) || match(c.city)).slice(0, 3)
        .map((c: any) => ({ id: c.id, type: 'customer' as EntityType, title: c.companyName ? `${c.name} · ${c.companyName}` : c.name, subtitle: `${c.phone} · ${c.city}`, icon: Users, url: `/customers/${c.id}` }));
      
      const matchedBrokers = brokers.filter((b: any) => match(b.id) || match(b.name) || match(b.companyName) || match(b.phone) || match(b.city)).slice(0, 3)
        .map((b: any) => ({ id: b.id, type: 'broker' as EntityType, title: b.companyName ? `${b.name} · ${b.companyName}` : b.name, subtitle: `${b.phone} · ${b.city}`, icon: Briefcase, url: `/brokers/${b.id}` }));
      
      const matchedLeads = leads.filter((l: any) => match(l.id) || match(l.status) || match(l.requirement) || match(l.source)).slice(0, 3)
        .map((l: any) => ({ id: l.id, type: 'lead' as EntityType, title: `${l.id} — ${(l.requirement && l.requirement.length > 30 ? l.requirement.substring(0, 30) + '...' : l.requirement) || 'N/A'}`, subtitle: `${l.source} · ${l.status}`, icon: Contact, url: `/leads/${l.id}` }));
      
      const matchedDeals = deals.filter((d: any) => match(d.id) || match(d.status)).slice(0, 3)
        .map((d: any) => {
          const truck = trucks.find((t: any) => t.id === d.truckId);
          const customer = customers.find((c: any) => c.id === d.customerId);
          return { id: d.id, type: 'deal' as EntityType, title: d.id, subtitle: `${truck?.registrationNumber || 'Unknown'} · ${customer?.name || 'Unknown'} · ${d.status}`, icon: Handshake, url: `/deals/${d.id}` };
        });
      
      const matchedLoans = loans.filter((l: any) => match(l.id) || match(l.status)).slice(0, 3)
        .map((l: any) => ({ id: l.id, type: 'loan' as EntityType, title: l.id, subtitle: `₹${formatINR.format(l.loanAmount || 0)} · ${l.status}`, icon: Landmark, url: `/loans/${l.id}` }));

      if (matchedTrucks.length) groups.push({ label: 'Trucks', items: matchedTrucks });
      if (matchedCustomers.length) groups.push({ label: 'Customers', items: matchedCustomers });
      if (matchedBrokers.length) groups.push({ label: 'Brokers', items: matchedBrokers });
      if (matchedLeads.length) groups.push({ label: 'Leads', items: matchedLeads });
      if (matchedDeals.length) groups.push({ label: 'Deals', items: matchedDeals });
      if (matchedLoans.length) groups.push({ label: 'Loans', items: matchedLoans });
    }

    return groups;
  }, [debouncedQuery]);

  const flatResults = useMemo(() => {
    return results.flatMap(g => g.items);
  }, [results]);

  useEffect(() => {
    setSelectedIndex(-1);
    if (debouncedQuery) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [debouncedQuery, results.length]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || !flatResults.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < flatResults.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < flatResults.length) {
        handleSelect(flatResults[selectedIndex]);
      } else if (flatResults.length > 0) {
        handleSelect(flatResults[0]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  const handleSelect = (item: SearchResult) => {
    setIsOpen(false);
    setQuery('');
    navigate(item.url);
  };

  let currentIndex = 0;

  return (
    <div className="flex-1 max-w-xl relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (debouncedQuery) setIsOpen(true); }}
          className="block w-full pl-10 pr-8 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-navy-900 focus:border-navy-900 sm:text-sm transition-all"
          placeholder="Search trucks, customers, deals..."
        />
        {query && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-2.5 flex items-center"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
          >
            <X className="h-4 w-4 text-slate-400 hover:text-slate-600 transition-colors" />
          </button>
        )}
      </div>

      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50"
        >
          {results.length > 0 ? (
            <div className="py-1">
              {results.map((group, groupIndex) => (
                <div key={groupIndex}>
                  <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-50 border-b border-slate-100 sticky top-0">
                    {group.label}
                  </div>
                  {group.items.map((item) => {
                    const idx = currentIndex++;
                    const isActive = idx === selectedIndex;
                    
                    return (
                      <div
                        key={`${item.type}-${item.id}`}
                        className={cn(
                          "px-3 py-2 flex items-center gap-3 hover:bg-slate-50 cursor-pointer transition-colors",
                          isActive && "bg-slate-50"
                        )}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                      >
                        <item.icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-navy-900 truncate">
                            {item.title}
                          </div>
                          <div className="text-xs text-slate-500 truncate">
                            {item.subtitle}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-6 text-center text-sm text-slate-400">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
