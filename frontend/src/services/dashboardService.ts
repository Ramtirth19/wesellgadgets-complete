import api from '../config/api';

export interface DashboardStats {
  overview: {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalCategories: number;
    monthlyRevenue: number;
    monthlyOrders: number;
  };
  recentOrders: any[];
  lowStockProducts: any[];
  topSellingProducts: any[];
  orderStatusDistribution: Record<string, number>;
}

export interface SalesAnalytics {
  dailySales: Array<{
    _id: string;
    revenue: number;
    orders: number;
  }>;
  categoryPerformance: Array<{
    _id: string;
    revenue: number;
    unitsSold: number;
  }>;
  period: number;
}

export const dashboardService = {
  async getDashboardStats(): Promise<{ success: boolean; data?: DashboardStats }> {
    try {
      const response = await api.request<{ success: boolean; data: DashboardStats }>('/dashboard/stats');
      return response;
    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error);
      return {
        success: false
      };
    }
  },

  async getSalesAnalytics(period: number = 30): Promise<{ success: boolean; data?: SalesAnalytics }> {
    try {
      const response = await api.request<{ success: boolean; data: SalesAnalytics }>(`/dashboard/analytics?period=${period}`);
      return response;
    } catch (error: any) {
      console.error('Error fetching sales analytics:', error);
      return {
        success: false
      };
    }
  }
};

export default dashboardService;