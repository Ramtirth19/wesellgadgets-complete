# MJOpenbox Frontend

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
   - `VITE_API_URL`: Backend API URL (default: http://localhost:5000/api)

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Default Login Credentials

- **Admin**: admin@mjopenbox.com / admin123
- **Customer**: user@example.com / password123

## Features

- Modern React 18 with TypeScript
- Responsive design with Tailwind CSS
- State management with Zustand
- Smooth animations with Framer Motion
- Product browsing and filtering
- Shopping cart functionality
- User authentication
- Order management
- Admin panel
- Real-time updates

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Zustand
- React Router
- Lucide Icons
- Vite

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── services/      # API services
├── store/         # State management
└── utils/         # Utility functions
```