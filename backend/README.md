# MJOpenbox Backend

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string for JWT tokens
   - Other optional configurations

3. **Start MongoDB**
   Make sure MongoDB is running on your system or use MongoDB Atlas.

4. **Run the Application**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm run build
   npm start
   ```

5. **Database Seeding**
   The application will automatically seed the database with sample data on first run if no users exist.

## Default Users

After seeding, you can login with:

- **Admin**: admin@mjopenbox.com / admin123
- **Customer**: user@example.com / password123

## API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/products` - Get all products
- `GET /api/categories` - Get all categories
- `POST /api/orders` - Create order (authenticated)
- And more...

## Features

- User authentication with JWT
- Product management
- Category management
- Order processing
- File upload support
- Email notifications
- Payment integration (Stripe)
- Admin panel