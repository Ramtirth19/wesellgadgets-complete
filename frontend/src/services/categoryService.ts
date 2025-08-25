import api from '../config/api';
import { Category } from '../store';

export interface CategoryResponse {
  success?: boolean;
  categories?: any[];
  data?: any[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface SingleCategoryResponse {
  success?: boolean;
  data?: any;
  category?: any;
}

export const categoryService = {
  async getCategories(): Promise<CategoryResponse> {
    try {
      const response: any = await api.categories.getAll();
      
      // Handle different response formats
      let categories: any[] = [];
      
      if (response.categories) {
        categories = response.categories;
      } else if (Array.isArray(response)) {
        categories = response;
      } else if (response.data) {
        categories = Array.isArray(response.data) ? response.data : [];
      }
      
      // Transform categories to ensure consistent format
      const transformedCategories: Category[] = categories.map((cat: any) => ({
        id: cat._id || cat.id,
        name: cat.name || '',
        slug: cat.slug || '',
        description: cat.description || '',
        image: cat.image || 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=400',
        productCount: Number(cat.productCount) || 0
      }));
      
      return { 
        success: true,
        categories: transformedCategories 
      };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return { 
        success: false,
        categories: [] 
      };
    }
  },

  async getCategoryById(id: string): Promise<SingleCategoryResponse> {
    try {
      const response: any = await api.categories.getById(id);
      return {
        success: true,
        data: response.data?.category || response.category || response
      };
    } catch (error) {
      console.error('Error fetching category:', error);
      return { success: false };
    }
  },

  async getCategoryBySlug(slug: string): Promise<SingleCategoryResponse> {
    try {
      const response: any = await api.categories.getBySlug(slug);
      return {
        success: true,
        data: response.data?.category || response.category || response
      };
    } catch (error) {
      console.error('Error fetching category:', error);
      return { success: false };
    }
  },

  async createCategory(categoryData: Omit<Category, 'id'>): Promise<{ success: boolean; data: { category: Category } }> {
    try {
      const response: any = await api.categories.create(categoryData);
      return {
        success: true,
        data: {
          category: {
            ...response.data?.category || response.category || response,
            id: response.data?.category?._id || response.category?._id || response._id
          }
        }
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create category');
    }
  },

  async updateCategory(id: string, categoryData: Partial<Category>): Promise<{ success: boolean; data: { category: Category } }> {
    try {
      const response: any = await api.categories.update(id, categoryData);
      return {
        success: true,
        data: {
          category: {
            ...response.data?.category || response.category || response,
            id: response.data?.category?._id || response.category?._id || response._id
          }
        }
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update category');
    }
  },

  async deleteCategory(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response: any = await api.categories.delete(id);
      return {
        success: true,
        message: response.message || 'Category deleted successfully'
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete category');
    }
  },
};

export default categoryService;