import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, Tag } from 'lucide-react';
import { categoryApi } from '../../api/categoryApi.js';
import Button from '../ui/Button.jsx';
import Badge from '../ui/Badge.jsx';
import Spinner from '../ui/Spinner.jsx';
import Modal from '../ui/Modal.jsx';
import CategoryForm from './CategoryForm.jsx';

export default function CategoryManager({ onCategoriesChanged }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this custom category?')) return;
    try {
      await categoryApi.delete(id);
      toast.success('Category deleted');
      loadCategories();
      if (onCategoriesChanged) onCategoriesChanged();
    } catch (err) {
      toast.error(err.message || 'Cannot delete category');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-900">Manage Categories</h4>
        <Button size="sm" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} className="mr-1" /> New Category
        </Button>
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
                <Badge variant={cat.type === 'INCOME' ? 'success' : 'default'} className="text-[10px] px-1.5 py-0">
                  {cat.type}
                </Badge>
              </div>
              {!cat.isDefault && (
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Category">
        <CategoryForm onSubmit={handleCreate} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}