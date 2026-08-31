import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, Upload } from 'lucide-react';
import { categoryApi } from '../../api/categoryApi.js';
import Button from '../ui/Button.jsx';
import Badge from '../ui/Badge.jsx';
import Spinner from '../ui/Spinner.jsx';
import Modal from '../ui/Modal.jsx';
import ConfirmModal from '../ui/ConfirmModal.jsx';
import CsvUpload from '../ui/CsvUpload.jsx';
import CategoryForm from './CategoryForm.jsx';

const CATEGORY_CSV_COLUMNS = ['name', 'type', 'icon', 'color'];
const CATEGORY_CSV_EXAMPLES = [
  ['Groceries', 'EXPENSE', 'ShoppingCart', '#EF4444'],
  ['Crypto', 'INCOME', 'Bitcoin', '#F59E0B'],
  ['Gym', 'EXPENSE', 'Dumbbell', '#8B5CF6'],
];

const CATEGORY_FIELD_DESCRIPTIONS = [
  <><strong>name</strong>: 2-50 characters, must be unique</>,
  <><strong>type</strong>: Must be either <code className="bg-blue-100 px-1 rounded">INCOME</code> or <code className="bg-blue-100 px-1 rounded">EXPENSE</code></>,
  <><strong>icon</strong>: Icon name (optional, defaults to "Tag")</>,
  <><strong>color</strong>: Hex color code like <code className="bg-blue-100 px-1 rounded">#EF4444</code> (optional, defaults to gray)</>,
];

const CATEGORY_INSTRUCTIONS = [
  'Category names must be unique — duplicates will be skipped.',
  'You cannot overwrite the 12 default system categories.',
  'Icon names can be any icon from Lucide React.',
];

export default function CategoryManager({ onCategoriesChanged }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryApi.getAll();
      setCategories(res.data || []);
    } catch (err) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreate = async (values) => {
    try {
      await categoryApi.create(values);
      toast.success('Category created successfully');
      setIsModalOpen(false);
      loadCategories();
      if (onCategoriesChanged) onCategoriesChanged();
    } catch (err) {
      toast.error(err.message || 'Failed to create category');
    }
  };

  const executeDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await categoryApi.delete(categoryToDelete);
      toast.success('Category deleted');
      setCategoryToDelete(null);
      loadCategories();
      if (onCategoriesChanged) onCategoriesChanged();
    } catch (err) {
      toast.error(err.message || 'Cannot delete category');
    }
  };

  const handleBulkUpload = async (file) => {
    const res = await categoryApi.bulkUpload(file);
    if (res.data?.successCount > 0) {
      toast.success(`${res.data.successCount} categories imported successfully`);
      loadCategories();
      if (onCategoriesChanged) onCategoriesChanged();
    }
    if (res.data?.failureCount > 0) {
      toast.error(`${res.data.failureCount} rows failed to import`);
    }
    return res;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h4 className="font-semibold text-gray-900">Manage Categories</h4>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setIsUploadOpen(true)}>
            <Upload size={14} className="mr-1" /> Import
          </Button>
          <Button size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} className="mr-1" /> New Category
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="py-8 flex justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="w-3.5 h-3.5 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color || '#64748B' }}
                />
                <span className="text-sm font-medium text-gray-800">{cat.name}</span>
                <Badge
                  variant={cat.type === 'INCOME' ? 'success' : 'default'}
                  className="text-[10px] px-1.5 py-0"
                >
                  {cat.type}
                </Badge>
              </div>
              {!cat.isDefault && (
                <button
                  onClick={() => setCategoryToDelete(cat.id)}
                  className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Category Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Category">
        <CategoryForm onSubmit={handleCreate} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={executeDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category? Any associated transactions will lose this category reference."
      />

      {/* CSV Upload Modal */}
      <Modal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Bulk Upload Categories"
        maxWidth="max-w-lg"
      >
        <CsvUpload
          onUpload={handleBulkUpload}
          entityName="Categories"
          templateColumns={CATEGORY_CSV_COLUMNS}
          templateExamples={CATEGORY_CSV_EXAMPLES}
          fieldDescriptions={CATEGORY_FIELD_DESCRIPTIONS}
          instructions={CATEGORY_INSTRUCTIONS}
        />
      </Modal>
    </div>
  );
}