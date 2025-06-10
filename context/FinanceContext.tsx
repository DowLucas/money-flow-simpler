import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';

export interface IncomeSource {
  id: string;
  name: string;
  amount: number;
  type: 'monthly' | 'yearly';
  source?: 'manual' | 'voice';
  createdAt?: string;
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  type: 'monthly' | 'static' | 'yearly';
  category?: string;
  source?: 'manual' | 'voice';
  createdAt?: string;
}

interface FinanceData {
  incomes: IncomeSource[];
  expenses: Expense[];
}

interface FinanceContextType {
  data: FinanceData;
  addIncome: (income: Omit<IncomeSource, 'id'>) => void;
  updateIncome: (id: string, income: Partial<Omit<IncomeSource, 'id'>>) => void;
  deleteIncome: (id: string) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<Omit<Expense, 'id'>>) => void;
  deleteExpense: (id: string) => void;
  getMonthlyAvailable: () => number;
  getTotalMonthlyIncome: () => number;
  getTotalMonthlyExpenses: () => number;
  addVoiceIncomes: (incomes: Omit<IncomeSource, 'id'>[]) => void;
  addVoiceExpenses: (expenses: Omit<Expense, 'id'>[]) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const STORAGE_KEY = 'finance_data';

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<FinanceData>({
    incomes: [],
    expenses: [],
  });

  // Load data from storage on mount
  useEffect(() => {
    loadData();
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    saveData();
  }, [data]);

  const loadData = async () => {
    try {
      if (Platform.OS === 'web') {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsedData = JSON.parse(stored);
          setData(parsedData);
          console.log('Loaded finance data:', parsedData);
        }
      }
    } catch (error) {
      console.error('Error loading finance data:', error);
    }
  };

  const saveData = async () => {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        console.log('Saved finance data:', data);
      }
    } catch (error) {
      console.error('Error saving finance data:', error);
    }
  };

  const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

  const addIncome = (income: Omit<IncomeSource, 'id'>) => {
    const newIncome: IncomeSource = {
      ...income,
      id: generateId(),
      source: income.source || 'manual',
      createdAt: new Date().toISOString(),
    };
    setData(prev => ({
      ...prev,
      incomes: [...prev.incomes, newIncome],
    }));
    console.log('Added income:', newIncome);
  };

  const updateIncome = (id: string, updates: Partial<Omit<IncomeSource, 'id'>>) => {
    setData(prev => ({
      ...prev,
      incomes: prev.incomes.map(income =>
        income.id === id ? { ...income, ...updates } : income
      ),
    }));
    console.log('Updated income:', id, updates);
  };

  const deleteIncome = (id: string) => {
    setData(prev => ({
      ...prev,
      incomes: prev.incomes.filter(income => income.id !== id),
    }));
    console.log('Deleted income:', id);
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: generateId(),
      source: expense.source || 'manual',
      createdAt: new Date().toISOString(),
    };
    setData(prev => ({
      ...prev,
      expenses: [...prev.expenses, newExpense],
    }));
    console.log('Added expense:', newExpense);
  };

  const updateExpense = (id: string, updates: Partial<Omit<Expense, 'id'>>) => {
    setData(prev => ({
      ...prev,
      expenses: prev.expenses.map(expense =>
        expense.id === id ? { ...expense, ...updates } : expense
      ),
    }));
    console.log('Updated expense:', id, updates);
  };

  const deleteExpense = (id: string) => {
    setData(prev => ({
      ...prev,
      expenses: prev.expenses.filter(expense => expense.id !== id),
    }));
    console.log('Deleted expense:', id);
  };

  const addVoiceIncomes = (incomes: Omit<IncomeSource, 'id'>[]) => {
    const newIncomes: IncomeSource[] = incomes.map(income => ({
      ...income,
      id: generateId(),
      source: 'voice',
      createdAt: new Date().toISOString(),
    }));
    
    setData(prev => ({
      ...prev,
      incomes: [...prev.incomes, ...newIncomes],
    }));
    
    console.log('Added voice incomes:', newIncomes);
  };

  const addVoiceExpenses = (expenses: Omit<Expense, 'id'>[]) => {
    const newExpenses: Expense[] = expenses.map(expense => ({
      ...expense,
      id: generateId(),
      source: 'voice',
      createdAt: new Date().toISOString(),
    }));
    
    setData(prev => ({
      ...prev,
      expenses: [...prev.expenses, ...newExpenses],
    }));
    
    console.log('Added voice expenses:', newExpenses);
  };

  const getTotalMonthlyIncome = () => {
    return data.incomes.reduce((total, income) => {
      const monthlyAmount = income.type === 'yearly' ? income.amount / 12 : income.amount;
      return total + monthlyAmount;
    }, 0);
  };

  const getTotalMonthlyExpenses = () => {
    return data.expenses.reduce((total, expense) => {
      let monthlyAmount = 0;
      switch (expense.type) {
        case 'monthly':
        case 'static':
          monthlyAmount = expense.amount;
          break;
        case 'yearly':
          monthlyAmount = expense.amount / 12;
          break;
      }
      return total + monthlyAmount;
    }, 0);
  };

  const getMonthlyAvailable = () => {
    const totalIncome = getTotalMonthlyIncome();
    const totalExpenses = getTotalMonthlyExpenses();
    return totalIncome - totalExpenses;
  };

  const contextValue: FinanceContextType = {
    data,
    addIncome,
    updateIncome,
    deleteIncome,
    addExpense,
    updateExpense,
    deleteExpense,
    getMonthlyAvailable,
    getTotalMonthlyIncome,
    getTotalMonthlyExpenses,
    addVoiceIncomes,
    addVoiceExpenses,
  };

  return (
    <FinanceContext.Provider value={contextValue}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}