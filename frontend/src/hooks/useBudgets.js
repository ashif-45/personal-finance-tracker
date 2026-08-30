import { useState, useEffect, useCallback } from 'react';
import { budgetApi } from '../api/budgetApi.js';

export function useBudgets() {
  const [budgets, setBudgets] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBudgets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await budgetApi.getCurrent();
      setBudgets(res.data || []);
    } catch {
      setBudgets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAlerts = useCallback(async () => {
    try {
      const res = await budgetApi.getAlerts();
      setAlerts(res.data || []);
    } catch {
      setAlerts([]);
    }
  }, []);

  useEffect(() => {
    loadBudgets();
    loadAlerts();
  }, [loadBudgets, loadAlerts]);

  return { budgets, alerts, loading, refetch: loadBudgets, refetchAlerts: loadAlerts };
}