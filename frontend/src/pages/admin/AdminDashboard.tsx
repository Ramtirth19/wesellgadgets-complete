import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Package, 
  Users, 
  DollarSign,
  ShoppingCart,
  Star,
  AlertCircle,
  Calendar,
  Eye,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useAdminStore, useProductStore } from '../../store';
import dashboardService from '../../services/dashboardService';
import { formatPrice, formatDate } from '../../utils/format';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const AdminDashboard: React.FC = () => {
  const { orders, fetchOrders } = useAdminStore();
  const { products, fetchProducts } = useProductStore();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [dashboardResponse] = await Promise.all([
          dashboardService.getDashboardStats(),
          fetchOrders(),
          fetchProducts()
        ]);

        if (dashboardResponse.success && dashboardResponse.data) {
          setDashboardData(dashboardResponse.data);
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadDashboardData();
  }, [fetchOrders, fetchProducts]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const recentOrders = dashboardData?.recentOrders || orders.slice(0, 5);
  const lowStockProducts = dashboardData?.lowStockProducts || products.filter(p => p.stockCount < 5).slice(0, 5);
  const overview = dashboardData?.overview || {
    totalUsers: 0,
    totalProducts: products.length,
    totalOrders: orders.length,
    totalCategories: 0,
    monthlyRevenue: 0,
    monthlyOrders: 0
  };

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatPrice(overview.monthlyRevenue),
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'text-success-600',
      bg: 'bg-success-50',
    },
    {
      title: 'Total Orders',
      value: overview.totalOrders.toString(),
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: ShoppingCart,
      color: 'text-primary-600',
      bg: 'bg-primary-50',
    },
    {
      title: 'Total Products',
      value: overview.totalProducts.toString(),
      change: '+3.1%',
      changeType: 'positive' as const,
      icon: Package,
      color: 'text-accent-600',
      bg: 'bg-accent-50',
    },
    {
      title: 'Active Users',
      value: overview.totalUsers.toString(),
      change: '+15.3%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'text-warning-600',
      bg: 'bg-warning-50',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'shipped':
        return 'info';
      case 'processing':
        return 'warning';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's what's happening with your store.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                  <div className="flex items-center mt-2">
                    {stat.changeType === 'positive' ? (
                      <ArrowUpRight className="w-4 h-4 text-success-500 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-danger-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-success-600' : 'text-danger-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      vs last month
                    </span>
                  </div>
                </div>
                <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Orders
            </h2>
            <Badge variant="info">{overview.totalOrders} total</Badge>
          </div>
          
          <div className="space-y-4">
            {recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No recent orders</p>
              </div>
            ) : (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Order #{order.orderNumber || order.id}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.user?.name || 'Customer'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {formatPrice(order.totalPrice)}
                    </p>
                    <Badge variant={getStatusColor(order.status) as any} size="sm">
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {recentOrders.length > 0 && (
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View All Orders
              </Button>
            </div>
          )}
        </Card>

        {/* Low Stock Alert */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Low Stock Alert
            </h2>
            <Badge variant="warning">{lowStockProducts.length} items</Badge>
          </div>
          
          <div className="space-y-4">
            {lowStockProducts.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">All products are well stocked!</p>
              </div>
            ) : (
              lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 bg-warning-50 rounded-lg border border-warning-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-warning-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {product.brand}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-warning-700">
                      {product.stockCount} left
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Add Product', icon: Package, href: '/admin/products' },
            { label: 'View Orders', icon: ShoppingCart, href: '/admin/orders' },
            { label: 'Manage Users', icon: Users, href: '/admin/users' },
            { label: 'Settings', icon: TrendingUp, href: '/admin/settings' },
          ].map((action) => (
            <Link
              key={action.label}
              to={action.href}
              className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <action.icon className="w-8 h-8 text-primary-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-900">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;