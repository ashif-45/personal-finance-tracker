import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Plus, Tags } from 'lucide-react';
import { transactionApi } from '../api/transactionApi.js';
import { categoryApi } from '../api/categoryApi.js';
import TransactionList from '../components/transactions/TransactionList.jsx';
import TransactionFilters from '../components/transactions/TransactionFilters.jsx';
import TransactionForm from '../components/transactions/TransactionForm.jsx';
import CategoryManager from '../components/categories/CategoryManager.jsx';
import Modal from '../components/ui/Modal.jsx';
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

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pageResponse, setPageResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  // Modals state
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const loadCategories = async () => {
    try {
      const res = await categoryApi.getAll();
      setCategories(res.data || []);
    } catch {
      toast.error('Failed to load categories');
    }
  };

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await transactionApi.getAll(filters);
      setTransactions(res.data.content || []);
      setPageResponse(res.data);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch transactions');
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

  const handleDeleteTx = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    try {
      await transactionApi.delete(id);
      toast.success('Transaction deleted');
      loadTransactions();
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track and filter all your incomes and expenses</p>
        </div>
        <div className="flex gap-2.5">
          <Button variant="outline" onClick={() => setIsCategoryModalOpen(true)}>
            <Tags size={16} className="mr-1.5" /> Categories
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

      {/* Filter Bar */}
      <TransactionFilters
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(INITIAL_FILTERS)}
        categories={categories}
      />

      {/* Table List */}
      <TransactionList
        transactions={transactions}
        loading={loading}
        pageResponse={pageResponse}
        onPageChange={(newPage) => setFilters((prev) => ({ ...prev, page: newPage }))}
        onEdit={(tx) => {
          setEditingTransaction(tx);
          setIsTxModalOpen(true);
        }}
        onDelete={handleDeleteTx}
      />

      {/* Transaction Modal */}
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

      {/* Categories Management Modal */}
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
    </div>
  );
}