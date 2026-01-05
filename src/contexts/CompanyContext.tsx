import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Company } from '@/types';

interface CompanyContextType {
  companies: Company[];
  currentCompany: Company | null;
  setCurrentCompany: (company: Company | null) => void;
  addCompany: (company: Omit<Company, 'id' | 'createdAt' | 'totalFiles' | 'totalProcessed'>) => void;
  updateCompany: (id: string, data: Partial<Company>) => void;
  deleteCompany: (id: string) => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

const STORAGE_KEY = 'alivee_companies';
const CURRENT_COMPANY_KEY = 'alivee_current_company';

// Sample data for initial load
const initialCompanies: Company[] = [
  {
    id: '1',
    cnpj: '12.345.678/0001-90',
    razaoSocial: 'Tecnologia Alpha Ltda',
    nomeFantasia: 'Alpha Tech',
    createdAt: new Date('2024-01-15'),
    totalFiles: 1250,
    totalProcessed: 1180,
  },
  {
    id: '2',
    cnpj: '98.765.432/0001-10',
    razaoSocial: 'Comércio Beta S.A.',
    nomeFantasia: 'Beta Commerce',
    createdAt: new Date('2024-02-20'),
    totalFiles: 890,
    totalProcessed: 890,
  },
  {
    id: '3',
    cnpj: '11.222.333/0001-44',
    razaoSocial: 'Serviços Gamma ME',
    nomeFantasia: 'Gamma Services',
    createdAt: new Date('2024-03-10'),
    totalFiles: 2340,
    totalProcessed: 2100,
  },
];

const loadCompaniesFromStorage = (): Company[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((c: any) => ({
        ...c,
        createdAt: new Date(c.createdAt),
      }));
    }
  } catch (error) {
    console.error('Error loading companies from localStorage:', error);
  }
  return initialCompanies;
};

const loadCurrentCompanyFromStorage = (companies: Company[]): Company | null => {
  try {
    const stored = localStorage.getItem(CURRENT_COMPANY_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const found = companies.find(c => c.id === parsed.id);
      if (found) return found;
    }
  } catch (error) {
    console.error('Error loading current company from localStorage:', error);
  }
  return companies.length > 0 ? companies[0] : null;
};

const saveCompaniesToStorage = (companies: Company[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(companies));
  } catch (error) {
    console.error('Error saving companies to localStorage:', error);
  }
};

const saveCurrentCompanyToStorage = (company: Company | null) => {
  try {
    if (company) {
      localStorage.setItem(CURRENT_COMPANY_KEY, JSON.stringify({ id: company.id }));
    } else {
      localStorage.removeItem(CURRENT_COMPANY_KEY);
    }
  } catch (error) {
    console.error('Error saving current company to localStorage:', error);
  }
};

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>(() => loadCompaniesFromStorage());
  const [currentCompany, setCurrentCompanyState] = useState<Company | null>(() => 
    loadCurrentCompanyFromStorage(loadCompaniesFromStorage())
  );

  // Persist companies when they change
  useEffect(() => {
    saveCompaniesToStorage(companies);
  }, [companies]);

  // Persist current company when it changes
  useEffect(() => {
    saveCurrentCompanyToStorage(currentCompany);
  }, [currentCompany]);

  const setCurrentCompany = useCallback((company: Company | null) => {
    setCurrentCompanyState(company);
  }, []);

  const addCompany = useCallback((data: Omit<Company, 'id' | 'createdAt' | 'totalFiles' | 'totalProcessed'>) => {
    const newCompany: Company = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
      totalFiles: 0,
      totalProcessed: 0,
    };
    setCompanies(prev => [...prev, newCompany]);
  }, []);

  const updateCompany = useCallback((id: string, data: Partial<Company>) => {
    setCompanies(prev => 
      prev.map(company => 
        company.id === id ? { ...company, ...data } : company
      )
    );
    if (currentCompany?.id === id) {
      setCurrentCompanyState(prev => prev ? { ...prev, ...data } : null);
    }
  }, [currentCompany]);

  const deleteCompany = useCallback((id: string) => {
    setCompanies(prev => prev.filter(company => company.id !== id));
    if (currentCompany?.id === id) {
      setCurrentCompanyState(null);
    }
  }, [currentCompany]);

  return (
    <CompanyContext.Provider value={{
      companies,
      currentCompany,
      setCurrentCompany,
      addCompany,
      updateCompany,
      deleteCompany,
    }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
}
