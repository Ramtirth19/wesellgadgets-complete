import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  FolderOpen,
  Image,
  Save,
  X
} from 'lucide-react';
import { useProductStore, useAdminStore } from '../../store';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';

const CategoryManagementPage: React.FC = () => {
  const { categories, fetchCategories } = useProductStore();
  const { addCategory, updateCategory, deleteCategory } = useAdminStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [categoryToEdit, setCategoryToEdit] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    image: '',
    slug: ''
  });

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleDeleteCategory = (id: string) => {
    setCategoryToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (categoryToDelete) {
      setLoading(true);
      setError('');
      try {
        await deleteCategory(categoryToDelete);
        await fetchCategories();
        setShowDeleteModal(false);
        setCategoryToDelete(null);
        
        // Show success message
        const event = new CustomEvent('cart-updated', { 
          detail: { message: 'Category deleted successfully!' } 
        });
        window.dispatchEvent(event);
      } catch (error: any) {
        console.error('Failed to delete category:', error);
        setError(error.message || 'Failed to delete category');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddCategory = () => {
    setNewCategory({ name: '', description: '', image: '', slug: '' });
    setError('');
    setShowAddModal(true);
  };

  const handleEditCategory = (category: any) => {
    setCategoryToEdit(category);
    setNewCategory({
      name: category.name,
      description: category.description,
      image: category.image,
      slug: category.slug
    });
    setError('');
    setShowEditModal(true);
  };

  const handleSaveCategory = async () => {
    if (!newCategory.name.trim() || !newCategory.description.trim()) {
      setError('Name and description are required');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const categoryData = {
        name: newCategory.name.trim(),
        description: newCategory.description.trim(),
        image: newCategory.image.trim() || 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=400',
        slug: generateSlug(newCategory.name)
      };

      await addCategory(categoryData);
      await fetchCategories();
      setShowAddModal(false);
      setNewCategory({ name: '', description: '', image: '', slug: '' });
      
      // Show success message
      const event = new CustomEvent('cart-updated', { 
        detail: { message: 'Category added successfully!' } 
      });
      window.dispatchEvent(event);
    } catch (error: any) {
      console.error('Failed to add category:', error);
      setError(error.message || 'Failed to add category');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (!newCategory.name.trim() || !newCategory.description.trim() || !categoryToEdit) {
      setError('Name and description are required');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const categoryData = {
        name: newCategory.name.trim(),
        description: newCategory.description.trim(),
        image: newCategory.image.trim() || categoryToEdit.image,
        slug: generateSlug(newCategory.name)
      };

      await updateCategory(categoryToEdit.id, categoryData);
      await fetchCategories();
      setShowEditModal(false);
      setCategoryToEdit(null);
      setNewCategory({ name: '', description: '', image: '', slug: '' });
      
      // Show success message
      const event = new CustomEvent('cart-updated', { 
        detail: { message: 'Category updated successfully!' } 
      });
      window.dispatchEvent(event);
    } catch (error: any) {
      console.error('Failed to update category:', error);
      setError(error.message || 'Failed to update category');
    } finally {
      setLoading(false);
    }
  };

  const totalProducts = categories.reduce((sum, cat) => sum + (cat.productCount || 0), 0);
  const avgProductsPerCategory = categories.length > 0 ? Math.round(totalProducts / categories.length) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
          <p className="text-gray-600 mt-2">
            Organize your products into categories
          </p>
        </div>
        <Button onClick={handleAddCategory}>
          <Plus className="w-5 h-5 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Categories</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            </div>
            <FolderOpen className="w-8 h-8 text-primary-600" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
            </div>
            <FolderOpen className="w-8 h-8 text-success-600" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Products/Category</p>
              <p className="text-2xl font-bold text-gray-900">{avgProductsPerCategory}</p>
            </div>
            <FolderOpen className="w-8 h-8 text-accent-600" />
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-6">
        <Input
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<Search className="w-4 h-4" />}
        />
      </Card>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden group">
              <div className="relative h-48">
                <img
                  src={category.image || 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=400'}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg font-bold">{category.name}</h3>
                  <p className="text-sm opacity-90">{category.productCount || 0} products</p>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex space-x-2">
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleEditCategory(category);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteCategory(category.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-2">
                  {category.name}
                </h4>
                <p className="text-gray-600 text-sm mb-4">
                  {category.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Slug: {category.slug}</span>
                  <span>{category.productCount || 0} items</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Add Category Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setError('');
        }}
        title="Add New Category"
      >
        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg text-danger-700 text-sm">
              {error}
            </div>
          )}
          <Input
            label="Category Name"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            placeholder="Enter category name"
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={newCategory.description}
              onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              placeholder="Enter category description"
              className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-3 px-4"
              rows={3}
              required
            />
          </div>
          <Input
            label="Image URL (optional)"
            value={newCategory.image}
            onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })}
            placeholder="https://example.com/image.jpg"
          />
          <div className="flex space-x-4 justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddModal(false);
                setError('');
              }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveCategory}
              disabled={!newCategory.name.trim() || !newCategory.description.trim() || loading}
              loading={loading}
            >
              <Save className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setError('');
        }}
        title="Edit Category"
      >
        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg text-danger-700 text-sm">
              {error}
            </div>
          )}
          <Input
            label="Category Name"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            placeholder="Enter category name"
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={newCategory.description}
              onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              placeholder="Enter category description"
              className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-3 px-4"
              rows={3}
              required
            />
          </div>
          <Input
            label="Image URL"
            value={newCategory.image}
            onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })}
            placeholder="https://example.com/image.jpg"
          />
          <div className="flex space-x-4 justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowEditModal(false);
                setError('');
              }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateCategory}
              disabled={!newCategory.name.trim() || !newCategory.description.trim() || loading}
              loading={loading}
            >
              <Save className="w-4 h-4 mr-2" />
              Update Category
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setError('');
        }}
        title="Delete Category"
      >
        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg text-danger-700 text-sm">
              {error}
            </div>
          )}
          <p className="text-gray-600">
            Are you sure you want to delete this category? This action cannot be undone.
            Products in this category will not be deleted but will need to be recategorized.
          </p>
          <div className="flex space-x-4 justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false);
                setError('');
              }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              loading={loading}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Category
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CategoryManagementPage;