import api from '../config/api';
import { Product } from '../store';

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string[];
  brand?: string[];
  inStock?: boolean;
  featured?: boolean;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface ProductResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination?: {
      currentPage: number;
      totalPages: number;
      totalProducts: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export const productService = {
  async getProducts(filters: ProductFilters = {}): Promise<ProductResponse> {
    try {
      const params = new URLSearchParams();
    
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });

      const response = await api.products.getAll(params);
      return {
        success: true,
        data: {
          products: response.data?.products || response.products || [],
          pagination: response.data?.pagination || response.pagination
        }
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      return {
        success: false,
        data: {
          products: [],
          pagination: undefined
        }
      };
    }
  },

  async getProductById(id: string): Promise<{ success: boolean; data: { product: Product } }> {
    try {
      const response = await api.products.getById(id);
      return {
        success: true,
        data: {
          product: response.data?.product || response.product || response
        }
      };
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  async createProduct(productData: Omit<Product, 'id' | 'createdAt'>): Promise<{ success: boolean; data: { product: Product } }> {
    try {
      const response = await api.products.create(productData);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create product');
    }
  },

  async updateProduct(id: string, productData: Partial<Product>): Promise<{ success: boolean; data: { product: Product } }> {
    try {
      const response = await api.products.update(id, productData);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update product');
    }
  },

  async deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.products.delete(id);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete product');
    }
  },

  async searchProducts(query: string): Promise<ProductResponse> {
    return this.getProducts({ search: query });
  },

  async getFeaturedProducts(): Promise<ProductResponse> {
    return this.getProducts({ featured: true, limit: 8 });
  },

  async getProductsByCategory(category: string): Promise<ProductResponse> {
    return this.getProducts({ category });
  },
};

export default productService;