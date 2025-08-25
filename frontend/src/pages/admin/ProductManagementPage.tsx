import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  AlertCircle,
  Save,
  X
} from 'lucide-react';
import { useProductStore, useAdminStore } from '../../store';
import { formatPrice, formatCondition, getConditionColor } from '../../utils/format';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';

const ProductManagementPage: React.FC = () => {
  const { products, categories, fetchProducts, fetchCategories } = useProductStore();
  const { addProduct, updateProduct, deleteProduct } = useAdminStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [productToEdit, setProductToEdit] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    brand: '',
    category: '',
    condition: 'good',
    stockCount: '',
    sku: '',
    images: [''],
    specifications: {} as Record<string, string>,
    features: [] as string[],
    featured: false
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const generateSKU = (name: string, brand: string) => {
    const nameCode = name.substring(0, 3).toUpperCase();
    const brandCode = brand.substring(0, 3).toUpperCase();
    const randomCode = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${brandCode}${nameCode}${randomCode}`;
  };

  const handleDeleteProduct = (id: string) => {
    setProductToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      setLoading(true);
      setError('');
      try {
        await deleteProduct(productToDelete);
        await fetchProducts();
        setShowDeleteModal(false);
        setProductToDelete(null);
        
        // Show success message
        const event = new CustomEvent('cart-updated', { 
          detail: { message: 'Product deleted successfully!' } 
        });
        window.dispatchEvent(event);
      } catch (error: any) {
        console.error('Failed to delete product:', error);
        setError(error.message || 'Failed to delete product');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddProduct = () => {
    setNewProduct({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      brand: '',
      category: '',
      condition: 'good',
      stockCount: '',
      sku: '',
      images: [''],
      specifications: {},
      features: [],
      featured: false
    });
    setError('');
    setShowAddModal(true);
  };

  const handleEditProduct = (product: any) => {
    setProductToEdit(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      brand: product.brand,
      category: product.category,
      condition: product.condition,
      stockCount: product.stockCount.toString(),
      sku: product.sku || '',
      images: product.images || [''],
      specifications: product.specifications || {},
      features: product.features || [],
      featured: product.featured || false
    });
    setError('');
    setShowEditModal(true);
  };

  const handleSaveProduct = async () => {
    if (!newProduct.name.trim() || !newProduct.price || !newProduct.category || !newProduct.brand.trim()) {
      setError('Name, price, brand, and category are required');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const categoryId = categories.find(cat => cat.name === newProduct.category)?.id;
      if (!categoryId) {
        setError('Invalid category selected');
        setLoading(false);
        return;
      }

      const productData = {
        name: newProduct.name.trim(),
        description: newProduct.description.trim(),
        price: parseFloat(newProduct.price),
        originalPrice: newProduct.originalPrice ? parseFloat(newProduct.originalPrice) : undefined,
        brand: newProduct.brand.trim(),
        category: categoryId,
        condition: newProduct.condition as 'excellent' | 'good' | 'fair' | 'refurbished',
        stockCount: parseInt(newProduct.stockCount) || 0,
        sku: newProduct.sku.trim() || generateSKU(newProduct.name, newProduct.brand),
        images: newProduct.images.filter(img => img.trim() !== ''),
        specifications: newProduct.specifications,
        features: newProduct.features,
        featured: newProduct.featured,
        warranty: {
          duration: 30,
          type: 'Limited Warranty',
          description: '30-day warranty covering manufacturing defects'
        }
      };

      await addProduct(productData);
      await fetchProducts();
      setShowAddModal(false);
      setNewProduct({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        brand: '',
        category: '',
        condition: 'good',
        stockCount: '',
        sku: '',
        images: [''],
        specifications: {},
        features: [],
        featured: false
      });
      
      // Show success message
      const event = new CustomEvent('cart-updated', { 
        detail: { message: 'Product added successfully!' } 
      });
      window.dispatchEvent(event);
    } catch (error: any) {
      console.error('Failed to add product:', error);
      setError(error.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async () => {
    if (!newProduct.name.trim() || !newProduct.price || !newProduct.category || !productToEdit) {
      setError('Name, price, and category are required');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const categoryId = categories.find(cat => cat.name === newProduct.category)?.id;
      if (!categoryId) {
        setError('Invalid category selected');
        setLoading(false);
        return;
      }

      const productData = {
        name: newProduct.name.trim(),
        description: newProduct.description.trim(),
        price: parseFloat(newProduct.price),
        originalPrice: newProduct.originalPrice ? parseFloat(newProduct.originalPrice) : undefined,
        brand: newProduct.brand.trim(),
        category: categoryId,
        condition: newProduct.condition as 'excellent' | 'good' | 'fair' | 'refurbished',
        stockCount: parseInt(newProduct.stockCount) || 0,
        sku: newProduct.sku.trim() || productToEdit.sku,
        images: newProduct.images.filter(img => img.trim() !== ''),
        specifications: newProduct.specifications,
        features: newProduct.features,
        featured: newProduct.featured
      };

      await updateProduct(productToEdit.id, productData);
      await fetchProducts();
      setShowEditModal(false);
      setProductToEdit(null);
      setNewProduct({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        brand: '',
        category: '',
        condition: 'good',
        stockCount: '',
        sku: '',
        images: [''],
        specifications: {},
        features: [],
        featured: false
      });
      
      // Show success message
      const event = new CustomEvent('cart-updated', { 
        detail: { message: 'Product updated successfully!' } 
      });
      window.dispatchEvent(event);
    } catch (error: any) {
      console.error('Failed to update product:', error);
      setError(error.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const lowStockProducts = products.filter(p => p.stockCount < 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600 mt-2">
            Manage your product inventory and listings
          </p>
        </div>
        <Button onClick={handleAddProduct}>
          <Plus className="w-5 h-5 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
            <Package className="w-8 h-8 text-primary-600" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.filter(p => p.inStock).length}
              </p>
            </div>
            <Package className="w-8 h-8 text-success-600" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">{lowStockProducts.length}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-warning-600" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            </div>
            <Package className="w-8 h-8 text-accent-600" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Products Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Condition
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product, index) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={product.images[0] || 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=400'}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg mr-4"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.brand}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${
                      product.stockCount < 5 ? 'text-warning-600' : 'text-gray-900'
                    }`}>
                      {product.stockCount}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge 
                      variant="info" 
                      size="sm"
                      className={getConditionColor(product.condition)}
                    >
                      {formatCondition(product.condition)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge 
                      variant={product.inStock ? 'success' : 'danger'}
                      size="sm"
                    >
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => window.open(`/product/${product.id}`, '_blank')}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-danger-600 hover:text-danger-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Product Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setError('');
        }}
        title="Add New Product"
        size="xl"
      >
        <div className="space-y-6">
          {error && (
            <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg text-danger-700 text-sm">
              {error}
            </div>
          )}
          
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Product Name *"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="Enter product name"
                required
              />
              <Input
                label="Brand *"
                value={newProduct.brand}
                onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                placeholder="Enter brand name"
                required
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                placeholder="Enter detailed product description"
                className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-3 px-4"
                rows={4}
                required
              />
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing & Inventory</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                label="Price ($) *"
                type="number"
                step="0.01"
                min="0"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                placeholder="0.00"
                required
              />
              <Input
                label="Original Price ($)"
                type="number"
                step="0.01"
                min="0"
                value={newProduct.originalPrice}
                onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                placeholder="0.00"
              />
              <Input
                label="Stock Count *"
                type="number"
                min="0"
                value={newProduct.stockCount}
                onChange={(e) => setNewProduct({ ...newProduct, stockCount: e.target.value })}
                placeholder="0"
                required
              />
              <Input
                label="SKU"
                value={newProduct.sku}
                onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                placeholder="Auto-generated if empty"
              />
            </div>
          </div>

          {/* Category & Condition */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Classification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-3 px-4"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Condition *
                </label>
                <select
                  value={newProduct.condition}
                  onChange={(e) => setNewProduct({ ...newProduct, condition: e.target.value })}
                  className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-3 px-4"
                  required
                >
                  <option value="excellent">Excellent (Like New)</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="refurbished">Certified Refurbished</option>
                </select>
              </div>
            </div>
          </div>

          {/* Images */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Images</h3>
            <Input
              label="Primary Image URL *"
              value={newProduct.images[0]}
              onChange={(e) => setNewProduct({ ...newProduct, images: [e.target.value] })}
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          {/* Options */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Options</h3>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                checked={newProduct.featured}
                onChange={(e) => setNewProduct({ ...newProduct, featured: e.target.checked })}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                Featured Product (Show on homepage)
              </label>
            </div>
          </div>

          <div className="flex space-x-4 justify-end pt-6 border-t">
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
              onClick={handleSaveProduct}
              disabled={!newProduct.name.trim() || !newProduct.price || !newProduct.category || !newProduct.brand.trim() || loading}
              loading={loading}
            >
              <Save className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setError('');
        }}
        title="Edit Product"
        size="xl"
      >
        <div className="space-y-6">
          {error && (
            <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg text-danger-700 text-sm">
              {error}
            </div>
          )}
          
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Product Name *"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="Enter product name"
                required
              />
              <Input
                label="Brand *"
                value={newProduct.brand}
                onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                placeholder="Enter brand name"
                required
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                placeholder="Enter detailed product description"
                className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-3 px-4"
                rows={4}
                required
              />
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing & Inventory</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                label="Price ($) *"
                type="number"
                step="0.01"
                min="0"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                placeholder="0.00"
                required
              />
              <Input
                label="Original Price ($)"
                type="number"
                step="0.01"
                min="0"
                value={newProduct.originalPrice}
                onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                placeholder="0.00"
              />
              <Input
                label="Stock Count *"
                type="number"
                min="0"
                value={newProduct.stockCount}
                onChange={(e) => setNewProduct({ ...newProduct, stockCount: e.target.value })}
                placeholder="0"
                required
              />
              <Input
                label="SKU"
                value={newProduct.sku}
                onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                placeholder="Product SKU"
              />
            </div>
          </div>

          {/* Category & Condition */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Classification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-3 px-4"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Condition *
                </label>
                <select
                  value={newProduct.condition}
                  onChange={(e) => setNewProduct({ ...newProduct, condition: e.target.value })}
                  className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-3 px-4"
                  required
                >
                  <option value="excellent">Excellent (Like New)</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="refurbished">Certified Refurbished</option>
                </select>
              </div>
            </div>
          </div>

          {/* Images */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Images</h3>
            <Input
              label="Primary Image URL *"
              value={newProduct.images[0]}
              onChange={(e) => setNewProduct({ ...newProduct, images: [e.target.value] })}
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          {/* Options */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Options</h3>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured-edit"
                checked={newProduct.featured}
                onChange={(e) => setNewProduct({ ...newProduct, featured: e.target.checked })}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="featured-edit" className="ml-2 text-sm text-gray-700">
                Featured Product (Show on homepage)
              </label>
            </div>
          </div>

          <div className="flex space-x-4 justify-end pt-6 border-t">
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
              onClick={handleUpdateProduct}
              disabled={!newProduct.name.trim() || !newProduct.price || !newProduct.category || !newProduct.brand.trim() || loading}
              loading={loading}
            >
              <Save className="w-4 h-4 mr-2" />
              Update Product
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
        title="Delete Product"
      >
        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg text-danger-700 text-sm">
              {error}
            </div>
          )}
          <p className="text-gray-600">
            Are you sure you want to delete this product? This action cannot be undone.
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
              Delete Product
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductManagementPage;