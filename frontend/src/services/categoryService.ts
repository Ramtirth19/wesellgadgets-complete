import api from '../config/api';
import { Category } from '../store';

export interface CategoryResponse {
  success?: boolean;
  categories?: Category[];
  data?: Category[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const categoryService = {
  async getCategories(): Promise<CategoryResponse> {
    try {
      const response = await api.categories.getAll();
      // Handle different response formats
      let categories = [];
      
      if (response.categories) {
        categories = response.categories;
      } else if (Array.isArray(response)) {
        categories = response;
      } else if (response.data) {
        categories = response.data;
      } else if (response.length !== undefined) {
        categories = response;
      }
      
      // Add productCount to categories if missing
      const categoriesWithCount = categories.map((cat: any) => ({
        ...cat,
        id: cat._id || cat.id,
        productCount: cat.productCount || 0
      }));
      
      return { 
        success: true,
        categories: categoriesWithCount 
      };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return { 
        success: false,
        categories: [] 
      };
    }
  },

  async getCategoryById(id: string): Promise<{ success: boolean; data?: Category; category?: Category }> {
    return api.categories.getById(id);
  },

  async getCategoryBySlug(slug: string): Promise<{ success: boolean; data?: Category; category?: Category }> {
    return api.categories.getBySlug(slug);
  },

  async createCategory(categoryData: Omit<Category, 'id'>): Promise<{ success: boolean; data: { category: Category } }> {
    try {
      const response = await api.categories.create(categoryData);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create category');
    }
  },

  async updateCategory(id: string, categoryData: Partial<Category>): Promise<{ success: boolean; data: { category: Category } }> {
    try {
      const response = await api.categories.update(id, categoryData);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update category');
    }
  },

  async deleteCategory(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.categories.delete(id);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete category');
    }
  },
};

export default categoryService;