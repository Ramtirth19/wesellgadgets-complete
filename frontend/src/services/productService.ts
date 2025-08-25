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
  data?: {
    products: Product[];
    pagination?: {
      currentPage: number;
      totalPages: number;
      totalProducts: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
  products?: Product[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface SingleProductResponse {
  success: boolean;
  data?: {
    product: Product;
  };
  product?: Product;
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

      const response: any = await api.products.getAll(params);
      
      // Handle different response formats
      let products: any[] = [];
      let pagination: any = undefined;
      
      if (response.data?.products) {
        products = response.data.products;
        pagination = response.data.pagination;
      } else if (response.products) {
        products = response.products;
        pagination = response.pagination;
      } else if (Array.isArray(response)) {
        products = response;
      }

      // Transform products to ensure consistent format
      const transformedProducts: Product[] = products.map((product: any) => ({
        id: product._id || product.id,
        _id: product._id,
        name: product.name || '',
        description: product.description || '',
        price: Number(product.price) || 0,
        originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
        condition: product.condition || 'good',
        category: (product.category as any)?.name || product.category || '',
        brand: product.brand || '',
        images: Array.isArray(product.images) ? product.images : [],
        specifications: (product as any).specifications || {},
        inStock: product.inStock !== undefined ? Boolean(product.inStock) : Boolean(product.stockCount > 0),
        stockCount: Number(product.stockCount) || 0,
        rating: Number(product.rating) || 0,
        reviewCount: Number(product.reviewCount) || 0,
        featured: Boolean(product.featured),
        createdAt: product.createdAt || new Date().toISOString()
      }));

      return {
        success: true,
        data: {
          products: transformedProducts,
          pagination
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

  async getProductById(id: string): Promise<Product | null> {
    try {
      const response: SingleProductResponse = await api.products.getById(id);
      
      let productData: Product | null = null;
      if (response.data?.product) {
        productData = response.data.product;
      } else if (response.product) {
        productData = response.product;
      } else if (response && typeof response === 'object' && 'name' in response) {
        productData = response as Product;
      }

      if (!productData) {
        return null;
      }

      // Transform product to ensure consistent format
      const transformedProduct: Product = {
        id: productData._id || productData.id,
        _id: productData._id,
        name: productData.name || '',
        description: productData.description || '',
        price: Number(productData.price) || 0,
        originalPrice: productData.originalPrice ? Number(productData.originalPrice) : undefined,
        condition: productData.condition || 'good',
        category: (productData.category as any)?.name || productData.category || '',
        brand: productData.brand || '',
        images: Array.isArray(productData.images) ? productData.images : [],
        specifications: (productData as any).specifications || {},
        inStock: productData.inStock !== undefined ? Boolean(productData.inStock) : Boolean(productData.stockCount > 0),
        stockCount: Number(productData.stockCount) || 0,
        rating: Number(productData.rating) || 0,
        reviewCount: Number(productData.reviewCount) || 0,
        featured: Boolean(productData.featured),
        createdAt: productData.createdAt || new Date().toISOString()
      };

      return transformedProduct;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },

  async createProduct(productData: Omit<Product, 'id' | 'createdAt'>): Promise<{ success: boolean; data: { product: Product } }> {
    try {
      const response: any = await api.products.create(productData);
      return {
        success: true,
        data: {
          product: {
            ...response.data?.product || response.product || response,
            id: response.data?.product?._id || response.product?._id || response._id
          }
        }
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create product');
    }
  },

  async updateProduct(id: string, productData: Partial<Product>): Promise<{ success: boolean; data: { product: Product } }> {
    try {
      const response: any = await api.products.update(id, productData);
      return {
        success: true,
        data: {
          product: {
            ...response.data?.product || response.product || response,
            id: response.data?.product?._id || response.product?._id || response._id
          }
        }
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update product');
    }
  },

  async deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response: any = await api.products.delete(id);
      return {
        success: true,
        message: response.message || 'Product deleted successfully'
      };
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