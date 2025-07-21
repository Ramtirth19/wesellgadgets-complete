import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  X,
  Eye,
  Search,
  Filter
} from 'lucide-react';
import { useAuthStore } from '../store';
import orderService from '../services/orderService';
import { formatPrice, formatDate } from '../utils/format';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';

const OrdersPage: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!isAuthenticated) return;
      
      setLoading(true);
      try {
        const response = await orderService.getUserOrders();
        if (response.success && response.data) {
          setOrders(response.data.orders || []);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        // Fallback to mock data for demo
        setOrders([
          {
            id: 'TV1234567890',
            createdAt: '2024-01-25T10:30:00Z',
            status: 'delivered',
            total: 1297,
            items: [
              {
                product: {
                  id: '1',
                  name: 'iPhone 14 Pro Max',
                  images: ['https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=400'],
                  price: 899
                },
                quantity: 1
              },
              {
                product: {
                  id: '2',
                  name: 'AirPods Pro 2nd Gen',
                  images: ['https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400'],
                  price: 199
                },
                quantity: 2
              }
            ],
            trackingNumber: 'TRK123456789',
            estimatedDelivery: '2024-01-30T00:00:00Z'
          },
          {
            id: 'TV1234567891',
            createdAt: '2024-01-20T14:15:00Z',
            status: 'shipped',
            total: 1899,
            items: [
              {
                product: {
                  id: '3',
                  name: 'MacBook Pro 16" M2',
                  images: ['https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400'],
                  price: 1899
                },
                quantity: 1
              }
            ],
            trackingNumber: 'TRK123456790',
            estimatedDelivery: '2024-01-28T00:00:00Z'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [isAuthenticated]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-success-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-primary-500" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-warning-500" />;
      case 'cancelled':
        return <X className="w-5 h-5 text-danger-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.items.some((item: any) => item.product.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Sign in to view your orders
          </h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to access your order history.
          </p>
          <Link to="/login">
            <Button>Sign In</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Orders
          </h1>
          <p className="text-gray-600">
            Track and manage your TechVault orders
          </p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search orders by ID or product name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="all">All Orders</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No orders found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : "You haven't placed any orders yet"
              }
            </p>
            <Link to="/products">
              <Button>Start Shopping</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden">
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-200 bg-gray-50">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(order.status)}
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Order #{order.id}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Placed on {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant={getStatusColor(order.status) as any}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                        <span className="font-bold text-lg text-gray-900">
                          {formatPrice(order.total)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-4 mb-6">
                      {order.items.map((item: any, itemIndex: number) => (
                        <div key={itemIndex} className="flex items-center space-x-4">
                          <img
                            src={item.product.images?.[0] || 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=400'}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {item.product.name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              Quantity: {item.quantity} • {formatPrice(item.product.price)} each
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              {formatPrice(item.product.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
                      <div className="flex-1">
                        {order.trackingNumber && (
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Tracking:</span> {order.trackingNumber}
                          </div>
                        )}
                        {order.estimatedDelivery && (
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Estimated Delivery:</span>{' '}
                            {formatDate(order.estimatedDelivery)}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        {order.status === 'shipped' && (
                          <Link to={`/track?tracking=${order.trackingNumber}`}>
                            <Button size="sm">
                              <Truck className="w-4 h-4 mr-2" />
                              Track Package
                            </Button>
                          </Link>
                        )}
                        {order.status === 'delivered' && (
                          <Button variant="outline" size="sm">
                            Reorder
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;