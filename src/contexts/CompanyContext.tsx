import React, { createContext, useContext, useState, useCallback } from 'react';
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

// Sample data
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

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(initialCompanies[0]);

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
      setCurrentCompany(prev => prev ? { ...prev, ...data } : null);
    }
  }, [currentCompany]);

  const deleteCompany = useCallback((id: string) => {
    setCompanies(prev => prev.filter(company => company.id !== id));
    if (currentCompany?.id === id) {
      setCurrentCompany(null);
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
