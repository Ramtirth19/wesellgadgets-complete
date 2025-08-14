# MJOpenbox - Premium Refurbished Electronics Marketplace

A full-stack MERN application for buying and selling refurbished electronics with a modern, responsive design.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mjopenbox
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Update .env with your MongoDB URI and other configs
   npm run dev
   ```

3. **Frontend Setup** (in a new terminal)
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Update .env with your backend API URL
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🔐 Default Login Credentials

- **Admin**: admin@mjopenbox.com / admin123
- **Customer**: user@example.com / password123

## 🛠 Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- Zustand for state management
- React Router for navigation
- Lucide React for icons

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- Bcrypt for password hashing
- Multer for file uploads
- Stripe for payments (optional)

## 📱 Features

### Customer Features
- Browse products by category
- Advanced search and filtering
- Product details with specifications
- Shopping cart functionality
- Secure checkout process
- Order tracking
- User profile management
- Responsive design

### Admin Features
- Product management (CRUD)
- Category management
- Order management
- User management
- Dashboard with analytics
- Inventory tracking
- Settings configuration

## 🏗 Project Structure

```
mjopenbox/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   ├── config/        # Configuration files
│   │   └── utils/         # Utility functions
│   └── uploads/           # File uploads
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── store/         # State management
│   │   └── utils/         # Utility functions
│   └── public/            # Static assets
└── README.md
```

## 🔧 Configuration

### Backend Environment Variables
```env
MONGO_URI=mongodb://localhost:27017/mjopenbox
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend Environment Variables
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=MJOpenbox
```

## 🚀 Deployment

### Backend Deployment
1. Build the application: `npm run build`
2. Set production environment variables
3. Deploy to your preferred platform (Heroku, Railway, etc.)

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist` folder to your preferred platform (Netlify, Vercel, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please contact the development team or create an issue in the repository.