# exFlow - Personal Finance Tracker

A modern, full-stack personal finance management application built with Next.js, TypeScript, and PostgreSQL. Track your expenses and income with a beautiful, responsive interface that supports both light and dark themes.

## 🚀 Features

- **Expense Management**: Add, edit, and delete expenses with categories and descriptions
- **Income Tracking**: Monitor your income sources and amounts
- **User Authentication**: Secure login and registration system
- **Category Management**: Organize transactions with customizable categories
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark/Light Theme**: Toggle between themes for comfortable viewing
- **Real-time Updates**: Instant feedback with toast notifications
- **Data Persistence**: PostgreSQL database for reliable data storage

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Database**: PostgreSQL with connection pooling
- **Authentication**: JWT tokens with bcrypt password hashing
- **State Management**: React Context API
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Runtime**: Bun (with npm compatibility)

## 📋 Prerequisites

- Node.js 18+ or Bun
- PostgreSQL database
- Git

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd exFlow
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Or using bun
bun install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database Configuration
PGUSER=your_postgres_user
PGPASSWORD=your_postgres_password
PGHOST=localhost
PGPORT=5432
PGDATABASE=exflow

# JWT Secret (generate a secure random string)
JWT_SECRET=your_jwt_secret_key
```

### 4. Database Setup

Run the database migrations:

```bash
# Using npm
npm run migrate

# Or using bun
bun run migrate
```

### 5. Start the Development Server

```bash
# Using npm
npm run dev

# Or using bun
bun dev
```

The application will be available at `http://localhost:3000`.

## 📁 Project Structure

```
exFlow/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── expenses/     # Expense management
│   │   ├── income/       # Income management
│   │   └── categories/   # Category management
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── common/          # Shared components
│   ├── expense/         # Expense-related components
│   ├── income/          # Income-related components
│   ├── finance/         # Finance utilities
│   └── ui/              # Reusable UI components
├── context/             # React Context providers
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── migrations/          # Database migrations
├── services/            # Business logic services
└── types/               # TypeScript type definitions
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality
- `npm run migrate` - Run database migrations

## 🗄️ Database Schema

The application uses the following main tables:

- **users**: User accounts with authentication
- **expense**: Expense transactions with categories
- **income**: Income transactions with sources
- **categories**: Customizable transaction categories
- **auth_tokens**: JWT token management

## 🎨 UI Components

Built with Radix UI primitives and styled with Tailwind CSS:

- Responsive design system
- Accessible components
- Dark/light theme support
- Form validation with error handling
- Toast notifications
- Modal dialogs and alerts

## 🔐 Authentication

- JWT-based authentication
- Secure password hashing with bcrypt
- Protected API routes
- Session management with cookies

## 📱 Features Overview

### Expense Management

- Add new expenses with title, amount, category, and date
- Edit existing expenses
- Delete expenses with confirmation
- Filter by date range
- Category-based organization

### Income Tracking

- Record income sources and amounts
- Track income by date
- Edit and delete income entries
- Income categorization

### User Experience

- Intuitive tabbed interface
- Real-time form validation
- Responsive design for all devices
- Smooth animations and transitions
- Accessible keyboard navigation

## 🔮 Future Enhancements

- [ ] Budget tracking and alerts
- [ ] Financial reports and analytics
- [ ] Data export functionality
- [ ] Multi-currency support
- [ ] Recurring transaction management
- [ ] Mobile app development
- [ ] Advanced categorization with subcategories
- [ ] Financial goal setting and tracking

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.
