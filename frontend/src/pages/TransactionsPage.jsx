import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Plus, Tags, Upload } from 'lucide-react';
import { transactionApi } from '../api/transactionApi.js';
import { categoryApi } from '../api/categoryApi.js';
import TransactionList from '../components/transactions/TransactionList.jsx';
import TransactionFilters from '../components/transactions/TransactionFilters.jsx';
import TransactionForm from '../components/transactions/TransactionForm.jsx';
import CategoryManager from '../components/categories/CategoryManager.jsx';
import CsvUpload from '../components/ui/CsvUpload.jsx';
import Modal from '../components/ui/Modal.jsx';
import ConfirmModal from '../components/ui/ConfirmModal.jsx';
import Button from '../components/ui/Button.jsx';

const INITIAL_FILTERS = {
  search: '',
  type: '',
  categoryId: '',
  startDate: '',
  endDate: '',
  page: 0,
  size: 10,
};

const TRANSACTION_CSV_COLUMNS = ['amount', 'type', 'categoryName', 'transactionDate', 'description'];
const TRANSACTION_CSV_EXAMPLES = [
  ['500.00', 'EXPENSE', 'Food', '2025-01-15', 'Lunch at restaurant'],
  ['50000.00', 'INCOME', 'Salary', '2025-01-01', 'January salary'],
];

const TRANSACTION_FIELD_DESCRIPTIONS = [
  <><strong>amount</strong>: Positive number with up to 2 decimals (e.g. 500.00)</>,
  <><strong>type</strong>: Must be either <code className="bg-blue-100 px-1 rounded">INCOME</code> or <code className="bg-blue-100 px-1 rounded">EXPENSE</code></>,
  <><strong>categoryName</strong>: Must exactly match an existing category</>,
  <><strong>transactionDate</strong>: Format <code className="bg-blue-100 px-1 rounded">yyyy-MM-dd</code></>,
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pageResponse, setPageResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  const loadCategories = async () => {
    try {
      const res = await categoryApi.getAll();
      setCategories(res.data || []);
    } catch {
      /* silent */
    }
  };

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await transactionApi.getAll(filters);
      setTransactions(res.data.content || []);
      setPageResponse(res.data);
    } catch (err) {
      toast.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const handleCreateOrUpdateTx = async (values) => {
    try {
      if (editingTransaction) {
        await transactionApi.update(editingTransaction.id, values);
        toast.success('Transaction updated successfully');
      } else {
        await transactionApi.create(values);
        toast.success('Transaction created successfully');
      }
      setIsTxModalOpen(false);
      setEditingTransaction(null);
      loadTransactions();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    }
  };

  const executeDelete = async () => {
    if (!transactionToDelete) return;
    try {
      await transactionApi.delete(transactionToDelete);
      toast.success('Transaction deleted');
      setTransactionToDelete(null);
      loadTransactions();
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  const handleBulkUpload = async (file) => {
    const res = await transactionApi.bulkUpload(file);
    if (res.data?.successCount > 0) {
      toast.success(`${res.data.successCount} transactions imported successfully`);
      loadTransactions();
    }
    if (res.data?.failureCount > 0) {
      toast.error(`${res.data.failureCount} rows failed to import`);
    }
    return res;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track and filter all your incomes and expenses</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Button variant="outline" onClick={() => setIsCategoryModalOpen(true)}>
            <Tags size={16} className="mr-1.5" /> Categories
          </Button>
          <Button variant="outline" onClick={() => setIsUploadModalOpen(true)}>
            <Upload size={16} className="mr-1.5" /> Import CSV
          </Button>
          <Button
            onClick={() => {
              setEditingTransaction(null);
              setIsTxModalOpen(true);
            }}
          >
            <Plus size={16} className="mr-1.5" /> Add Transaction
          </Button>
        </div>
      </div>

      <TransactionFilters
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(INITIAL_FILTERS)}
        categories={categories}
      />

      <TransactionList
        transactions={transactions}
        loading={loading}
        pageResponse={pageResponse}
        onPageChange={(newPage) => setFilters((prev) => ({ ...prev, page: newPage }))}
        onPageSizeChange={(newSize) => setFilters((prev) => ({ ...prev, size: newSize, page: 0 }))}
        onEdit={(tx) => {
          setEditingTransaction(tx);
          setIsTxModalOpen(true);
        }}
        onDelete={(id) => setTransactionToDelete(id)}
      />

      <Modal
        isOpen={isTxModalOpen}
        onClose={() => {
          setIsTxModalOpen(false);
          setEditingTransaction(null);
        }}
        title={editingTransaction ? 'Edit Transaction' : 'New Transaction'}
      >
        <TransactionForm
          categories={categories}
          initialData={editingTransaction}
          onSubmit={handleCreateOrUpdateTx}
          onCancel={() => {
            setIsTxModalOpen(false);
            setEditingTransaction(null);
          }}
        />
      </Modal>

      <ConfirmModal
        isOpen={!!transactionToDelete}
        onClose={() => setTransactionToDelete(null)}
        onConfirm={executeDelete}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone and will affect your balance."
      />

      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title="Category Settings"
        maxWidth="max-w-2xl"
      >
        <CategoryManager
          onCategoriesChanged={() => {
            loadCategories();
            loadTransactions();
          }}
        />
      </Modal>

      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Bulk Upload Transactions"
        maxWidth="max-w-lg"
      >
        <CsvUpload
          onUpload={handleBulkUpload}
          entityName="Transactions"
          templateColumns={TRANSACTION_CSV_COLUMNS}
          templateExamples={TRANSACTION_CSV_EXAMPLES}
          fieldDescriptions={TRANSACTION_FIELD_DESCRIPTIONS}
        />
      </Modal>
    </div>
  );
}