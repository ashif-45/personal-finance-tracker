import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import { budgetApi } from '../api/budgetApi.js';
import { categoryApi } from '../api/categoryApi.js';
import BudgetList from '../components/budgets/BudgetList.jsx';
import BudgetForm from '../components/budgets/BudgetForm.jsx';
import Modal from '../components/ui/Modal.jsx';
import Button from '../components/ui/Button.jsx';

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const loadCategories = async () => {
    try {
      const res = await categoryApi.getAll();
      setCategories(res.data || []);
    } catch { /* silent */ }
  };

  const loadBudgets = async () => {
    setLoading(true);
    try {
      const res = await budgetApi.getCurrent();
      setBudgets(res.data || []);
    } catch (err) {
      toast.error('Failed to load budgets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
    loadBudgets();
  }, []);

  const handleCreateOrUpdate = async (values) => {
    try {
      // Convert empty categoryId to null
      const payload = {
        ...values,
        categoryId: values.categoryId || null,
      };

      if (editingBudget) {
        await budgetApi.update(editingBudget.id, payload);
        toast.success('Budget updated successfully');
      } else {
        await budgetApi.create(payload);
        toast.success('Budget created successfully');
      }
      setIsModalOpen(false);
      setEditingBudget(null);
      loadBudgets();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this budget?')) return;
    try {
      await budgetApi.delete(id);
      toast.success('Budget deleted');
      loadBudgets();
    } catch (err) {
      toast.error(err.message || 'Failed to delete budget');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Budgets</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Set monthly spending limits and track your progress
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingBudget(null);
            setIsModalOpen(true);
          }}
        >
          <Plus size={16} className="mr-1.5" /> Set Budget
        </Button>
      </div>

      {/* Budget Cards */}
      <BudgetList
        budgets={budgets}
        loading={loading}
        onEdit={(budget) => {
          setEditingBudget(budget);
          setIsModalOpen(true);
        }}
        onDelete={handleDelete}
      />

      {/* Budget Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBudget(null);
        }}
        title={editingBudget ? 'Edit Budget' : 'Set New Budget'}
      >
        <BudgetForm
          categories={categories}
          initialData={editingBudget}
          onSubmit={handleCreateOrUpdate}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingBudget(null);
          }}
        />
      </Modal>
    </div>
  );
}