import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Plus, Upload, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { budgetApi } from '../api/budgetApi.js';
import { categoryApi } from '../api/categoryApi.js';
import BudgetList from '../components/budgets/BudgetList.jsx';
import BudgetForm from '../components/budgets/BudgetForm.jsx';
import CsvUpload from '../components/ui/CsvUpload.jsx';
import Modal from '../components/ui/Modal.jsx';
import ConfirmModal from '../components/ui/ConfirmModal.jsx';
import Button from '../components/ui/Button.jsx';
import Select from '../components/ui/Select.jsx';

const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

const BUDGET_CSV_COLUMNS = ['amount', 'month', 'year', 'categoryName', 'alertThreshold'];
const BUDGET_CSV_EXAMPLES = [
  ['5000', '1', '2025', 'Food', '80'],
  ['3000', '1', '2025', 'Transport', '90'],
  ['10000', '1', '2025', '', '85'],
];

const BUDGET_FIELD_DESCRIPTIONS = [
  <><strong>amount</strong>: Positive number (e.g. 5000)</>,
  <><strong>month</strong>: Number 1-12 (1 = January, 12 = December)</>,
  <><strong>year</strong>: 4-digit year (e.g. 2025)</>,
  <><strong>categoryName</strong>: EXPENSE category name, or leave <em>empty</em> for overall budget</>,
  <><strong>alertThreshold</strong>: Percentage between 10-100 (e.g. 80)</>,
];

const BUDGET_INSTRUCTIONS = [
  'Only EXPENSE categories can have budgets.',
  'Leaving categoryName empty creates an overall budget for that month.',
  'Only one budget per category per month is allowed — duplicates will fail.',
];

function buildYearOptions() {
  const current = new Date().getFullYear();
  // From 5 years ago to 2 years ahead
  const years = [];
  for (let y = current + 2; y >= current - 5; y--) {
    years.push({ value: y, label: String(y) });
  }
  return years;
}

export default function BudgetsPage() {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [budgetToDelete, setBudgetToDelete] = useState(null);

  const yearOptions = buildYearOptions();

  const isCurrentPeriod =
    selectedMonth === now.getMonth() + 1 && selectedYear === now.getFullYear();

  const periodLabel =
    MONTHS.find((m) => m.value === selectedMonth)?.label + ' ' + selectedYear;

  const loadCategories = async () => {
    try {
      const res = await categoryApi.getAll();
      setCategories(res.data || []);
    } catch {
      /* silent */
    }
  };

  const loadBudgets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await budgetApi.getByPeriod(selectedMonth, selectedYear);
      setBudgets(res.data || []);
    } catch {
      toast.error('Failed to load budgets');
      setBudgets([]);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadBudgets();
  }, [loadBudgets]);

  /** Go to previous month (handles year rollover) */
  const goToPreviousMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear((y) => y - 1);
    } else {
      setSelectedMonth((m) => m - 1);
    }
  };

  /** Go to next month (handles year rollover) */
  const goToNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear((y) => y + 1);
    } else {
      setSelectedMonth((m) => m + 1);
    }
  };

  const goToCurrentMonth = () => {
    setSelectedMonth(now.getMonth() + 1);
    setSelectedYear(now.getFullYear());
  };

  const handleCreateOrUpdate = async (values) => {
    try {
      const payload = {
        ...values,
        categoryId: values.categoryId || null,
        // Default form month/year to the currently viewed period when creating
        month: values.month ?? selectedMonth,
        year: values.year ?? selectedYear,
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

  const executeDelete = async () => {
    if (!budgetToDelete) return;
    try {
      await budgetApi.delete(budgetToDelete);
      toast.success('Budget deleted');
      setBudgetToDelete(null);
      loadBudgets();
    } catch (err) {
      toast.error(err.message || 'Failed to delete budget');
    }
  };

  const handleBulkUpload = async (file) => {
    const res = await budgetApi.bulkUpload(file);
    if (res.data?.successCount > 0) {
      toast.success(`${res.data.successCount} budgets imported successfully`);
      loadBudgets();
    }
    if (res.data?.failureCount > 0) {
      toast.error(`${res.data.failureCount} rows failed to import`);
    }
    return res;
  };

  // Prefill BudgetForm with selected period when creating new
  const formInitialData = editingBudget
    ? editingBudget
    : {
        month: selectedMonth,
        year: selectedYear,
        alertThreshold: 80,
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
        <div className="flex flex-wrap gap-2.5">
          <Button variant="outline" onClick={() => setIsUploadModalOpen(true)}>
            <Upload size={16} className="mr-1.5" /> Import CSV
          </Button>
          <Button
            onClick={() => {
              setEditingBudget(null);
              setIsModalOpen(true);
            }}
          >
            <Plus size={16} className="mr-1.5" /> Set Budget
          </Button>
        </div>
      </div>

      {/* Month / Year Navigator */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Prev / Label / Next */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToPreviousMonth}
              className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              title="Previous month"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-2 min-w-[180px] justify-center">
              <Calendar size={16} className="text-blue-600" />
              <span className="text-base font-semibold text-gray-900">{periodLabel}</span>
              {isCurrentPeriod && (
                <span className="text-[10px] font-bold uppercase tracking-wide text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                  Current
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={goToNextMonth}
              className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              title="Next month"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Dropdown selectors + Jump to current */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-[140px]">
              <Select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                options={MONTHS}
              />
            </div>
            <div className="w-[100px]">
              <Select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                options={yearOptions}
              />
            </div>
            {!isCurrentPeriod && (
              <Button size="sm" variant="outline" onClick={goToCurrentMonth}>
                This month
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Budget Cards for selected period */}
      <BudgetList
        budgets={budgets}
        loading={loading}
        emptyMessage={
          loading
            ? null
            : `No budgets set for ${periodLabel}.`
        }
        emptyHint='Click "Set Budget" to create one for this period.'
        onEdit={(budget) => {
          setEditingBudget(budget);
          setIsModalOpen(true);
        }}
        onDelete={(id) => setBudgetToDelete(id)}
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBudget(null);
        }}
        title={editingBudget ? 'Edit Budget' : `Set Budget — ${periodLabel}`}
      >
        <BudgetForm
          categories={categories}
          initialData={formInitialData}
          onSubmit={handleCreateOrUpdate}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingBudget(null);
          }}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!budgetToDelete}
        onClose={() => setBudgetToDelete(null)}
        onConfirm={executeDelete}
        title="Delete Budget"
        message="Are you sure you want to delete this budget? You will no longer receive alerts for this category in that period."
      />

      {/* CSV Upload */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Bulk Upload Budgets"
        maxWidth="max-w-lg"
      >
        <CsvUpload
          onUpload={handleBulkUpload}
          entityName="Budgets"
          templateColumns={BUDGET_CSV_COLUMNS}
          templateExamples={BUDGET_CSV_EXAMPLES}
          fieldDescriptions={BUDGET_FIELD_DESCRIPTIONS}
          instructions={BUDGET_INSTRUCTIONS}
        />
      </Modal>
    </div>
  );
}