import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Category from '../models/Category';
import Product from '../models/Product';

export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@techvault.com',
      password: adminPassword,
      role: 'admin',
      isEmailVerified: true
    });

    // Create customer user
    const customerPassword = await bcrypt.hash('password123', 12);
    const customer = await User.create({
      name: 'John Doe',
      email: 'user@example.com',
      password: customerPassword,
      role: 'customer',
      isEmailVerified: true
    });

    console.log('✅ Users created');

    // Create categories
    const categories = await Category.create([
      {
        name: 'Smartphones',
        slug: 'smartphones',
        description: 'Premium refurbished smartphones with warranty',
        image: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=400',
        isActive: true,
        sortOrder: 1
      },
      {
        name: 'Laptops',
        slug: 'laptops',
        description: 'High-performance laptops for work and gaming',
        image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400',
        isActive: true,
        sortOrder: 2
      },
      {
        name: 'Tablets',
        slug: 'tablets',
        description: 'Versatile tablets for productivity and entertainment',
        image: 'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=400',
        isActive: true,
        sortOrder: 3
      },
      {
        name: 'Gaming Consoles',
        slug: 'gaming-consoles',
        description: 'Latest gaming consoles and accessories',
        image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400',
        isActive: true,
        sortOrder: 4
      },
      {
        name: 'Audio & Headphones',
        slug: 'audio-headphones',
        description: 'Premium audio equipment and headphones',
        image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
        isActive: true,
        sortOrder: 5
      },
      {
        name: 'Smart Watches',
        slug: 'smart-watches',
        description: 'Advanced smartwatches and fitness trackers',
        image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400',
        isActive: true,
        sortOrder: 6
      }
    ]);

    console.log('✅ Categories created');

    // Create products
    const products = await Product.create([
      {
        name: 'iPhone 14 Pro Max',
        description: 'Flagship smartphone with A16 Bionic chip, ProRAW camera system, and Dynamic Island. Fully tested and certified refurbished.',
        price: 899,
        originalPrice: 1099,
        condition: 'excellent',
        category: categories[0]._id, // Smartphones
        brand: 'Apple',
        images: [
          'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        specifications: new Map([
          ['Display', '6.7" Super Retina XDR'],
          ['Storage', '256GB'],
          ['RAM', '6GB'],
          ['Camera', '48MP Triple Camera'],
          ['Battery', '4323mAh'],
          ['OS', 'iOS 16']
        ]),
        inStock: true,
        stockCount: 12,
        sku: 'IPH14PM256',
        rating: 4.8,
        reviewCount: 234,
        featured: true,
        tags: ['smartphone', 'apple', 'flagship'],
        warranty: {
          duration: 30,
          type: 'Limited Warranty',
          description: '30-day warranty covering manufacturing defects'
        }
      },
      {
        name: 'MacBook Pro 16" M2',
        description: 'Professional laptop with M2 Pro chip, stunning Liquid Retina XDR display, and all-day battery life. Perfect for creators and developers.',
        price: 1899,
        originalPrice: 2499,
        condition: 'excellent',
        category: categories[1]._id, // Laptops
        brand: 'Apple',
        images: [
          'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        specifications: new Map([
          ['Processor', 'Apple M2 Pro'],
          ['Display', '16.2" Liquid Retina XDR'],
          ['Storage', '512GB SSD'],
          ['RAM', '16GB'],
          ['Graphics', 'M2 Pro GPU'],
          ['Battery', 'Up to 22 hours']
        ]),
        inStock: true,
        stockCount: 8,
        sku: 'MBP16M2512',
        rating: 4.9,
        reviewCount: 156,
        featured: true,
        tags: ['laptop', 'apple', 'professional'],
        warranty: {
          duration: 30,
          type: 'Limited Warranty',
          description: '30-day warranty covering manufacturing defects'
        }
      },
      {
        name: 'Samsung Galaxy S23 Ultra',
        description: 'Ultimate Android flagship with S Pen, 200MP camera, and premium build quality. Thoroughly inspected and warranty included.',
        price: 799,
        originalPrice: 1199,
        condition: 'good',
        category: categories[0]._id, // Smartphones
        brand: 'Samsung',
        images: [
          'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        specifications: new Map([
          ['Display', '6.8" Dynamic AMOLED 2X'],
          ['Storage', '256GB'],
          ['RAM', '12GB'],
          ['Camera', '200MP Quad Camera'],
          ['Battery', '5000mAh'],
          ['OS', 'Android 13']
        ]),
        inStock: true,
        stockCount: 15,
        sku: 'SGS23U256',
        rating: 4.7,
        reviewCount: 189,
        featured: true,
        tags: ['smartphone', 'samsung', 'android'],
        warranty: {
          duration: 30,
          type: 'Limited Warranty',
          description: '30-day warranty covering manufacturing defects'
        }
      },
      {
        name: 'iPad Pro 12.9" M2',
        description: 'Most advanced iPad with M2 chip, Liquid Retina XDR display, and Apple Pencil support. Perfect for creative professionals.',
        price: 899,
        originalPrice: 1099,
        condition: 'excellent',
        category: categories[2]._id, // Tablets
        brand: 'Apple',
        images: [
          'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1334598/pexels-photo-1334598.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        specifications: new Map([
          ['Processor', 'Apple M2'],
          ['Display', '12.9" Liquid Retina XDR'],
          ['Storage', '256GB'],
          ['RAM', '8GB'],
          ['Camera', '12MP + 10MP Ultra Wide'],
          ['Battery', 'Up to 10 hours']
        ]),
        inStock: true,
        stockCount: 6,
        sku: 'IPADPM2256',
        rating: 4.8,
        reviewCount: 98,
        featured: false,
        tags: ['tablet', 'apple', 'creative'],
        warranty: {
          duration: 30,
          type: 'Limited Warranty',
          description: '30-day warranty covering manufacturing defects'
        }
      },
      {
        name: 'PlayStation 5',
        description: 'Next-gen gaming console with ultra-high speed SSD, ray tracing, and 3D audio. Includes DualSense controller.',
        price: 449,
        originalPrice: 499,
        condition: 'good',
        category: categories[3]._id, // Gaming Consoles
        brand: 'Sony',
        images: [
          'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        specifications: new Map([
          ['CPU', 'AMD Zen 2'],
          ['GPU', 'AMD RDNA 2'],
          ['Storage', '825GB SSD'],
          ['RAM', '16GB GDDR6'],
          ['Resolution', 'Up to 8K'],
          ['Ray Tracing', 'Hardware accelerated']
        ]),
        inStock: true,
        stockCount: 4,
        sku: 'PS5CONSOLE',
        rating: 4.9,
        reviewCount: 267,
        featured: true,
        tags: ['gaming', 'console', 'sony'],
        warranty: {
          duration: 30,
          type: 'Limited Warranty',
          description: '30-day warranty covering manufacturing defects'
        }
      },
      {
        name: 'AirPods Pro 2nd Gen',
        description: 'Premium wireless earbuds with active noise cancellation, spatial audio, and adaptive transparency.',
        price: 199,
        originalPrice: 249,
        condition: 'excellent',
        category: categories[4]._id, // Audio & Headphones
        brand: 'Apple',
        images: [
          'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/8534088/pexels-photo-8534088.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        specifications: new Map([
          ['Driver', 'Custom high-excursion'],
          ['Noise Cancellation', 'Active'],
          ['Battery', 'Up to 6 hours'],
          ['Charging Case', 'Up to 30 hours'],
          ['Water Resistance', 'IPX4'],
          ['Connectivity', 'Bluetooth 5.3']
        ]),
        inStock: true,
        stockCount: 20,
        sku: 'APPRO2GEN',
        rating: 4.6,
        reviewCount: 145,
        featured: false,
        tags: ['audio', 'wireless', 'apple'],
        warranty: {
          duration: 30,
          type: 'Limited Warranty',
          description: '30-day warranty covering manufacturing defects'
        }
      },
      {
        name: 'Apple Watch Series 8',
        description: 'Advanced health and fitness tracking with ECG, blood oxygen monitoring, and crash detection.',
        price: 329,
        originalPrice: 399,
        condition: 'good',
        category: categories[5]._id, // Smart Watches
        brand: 'Apple',
        images: [
          'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        specifications: new Map([
          ['Display', '45mm Always-On Retina'],
          ['Health', 'ECG, Blood Oxygen, Temperature'],
          ['Fitness', 'GPS, Cellular optional'],
          ['Battery', 'Up to 18 hours'],
          ['Water Resistance', '50 meters'],
          ['OS', 'watchOS 9']
        ]),
        inStock: true,
        stockCount: 11,
        sku: 'AWS8-45MM',
        rating: 4.7,
        reviewCount: 203,
        featured: false,
        tags: ['smartwatch', 'fitness', 'apple'],
        warranty: {
          duration: 30,
          type: 'Limited Warranty',
          description: '30-day warranty covering manufacturing defects'
        }
      },
      {
        name: 'Dell XPS 13 Plus',
        description: 'Ultra-premium Windows laptop with 12th Gen Intel Core, stunning OLED display, and premium materials.',
        price: 1299,
        originalPrice: 1699,
        condition: 'excellent',
        category: categories[1]._id, // Laptops
        brand: 'Dell',
        images: [
          'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800'
        ],
        specifications: new Map([
          ['Processor', 'Intel Core i7-1260P'],
          ['Display', '13.4" OLED 3.5K'],
          ['Storage', '512GB SSD'],
          ['RAM', '16GB LPDDR5'],
          ['Graphics', 'Intel Iris Xe'],
          ['Battery', 'Up to 12 hours']
        ]),
        inStock: true,
        stockCount: 5,
        sku: 'DELLXPS13P',
        rating: 4.5,
        reviewCount: 87,
        featured: false,
        tags: ['laptop', 'dell', 'premium'],
        warranty: {
          duration: 30,
          type: 'Limited Warranty',
          description: '30-day warranty covering manufacturing defects'
        }
      }
    ]);

    console.log('✅ Products created');
    console.log(`🎉 Database seeded successfully!`);
    console.log(`📊 Created: ${categories.length} categories, ${products.length} products, 2 users`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};