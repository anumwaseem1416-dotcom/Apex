# CRM System for Mobile & Accessories Business

A complete Customer Relationship Management system built for mobile phone and accessories businesses with integrated website functionality.

## 🚀 Features

### Core Modules
- **Product & Stock Management**: Phones, Laptops, Watches, Accessories
- **Customer Management**: Customer profiles with credit tracking
- **Sales Management**: Complete sales workflow with automatic stock updates
- **Credit & Reminder System**: Automated credit tracking and reminders
- **Profit & Expense Management**: Monthly profit calculations
- **Dashboard Analytics**: Real-time business insights
- **Role-based Access Control**: Admin, Staff, Accountant roles

### Key Capabilities
- **Phone Tracking**: Individual phone tracking using IMEI numbers
- **Automatic Stock Updates**: Stock levels update automatically on sales
- **Credit Management**: Track partial payments and outstanding amounts
- **Profit Calculation**: Automatic monthly profit calculations
- **Reminder System**: Automated credit reminders (configurable)
- **Multi-user Support**: Role-based access control
- **API Integration**: RESTful API for website integration

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT-based authentication
- **Validation**: Zod schema validation
- **Scheduling**: Node-cron for automated tasks

### Frontend
- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Forms**: React Hook Form
- **State Management**: React Context API

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Backend Setup

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup database**
   ```bash
   npm run db:generate
   npm run db:push
   ```

4. **Seed initial data**
   ```bash
   npm run db:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

Backend will run on `http://localhost:3001`

### Frontend Setup

1. **Navigate to project root**
   ```bash
   cd ..
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

Frontend will run on `http://localhost:5173`

## 🔐 Default Login Credentials

```
Email: admin@crm.com
Password: admin123
Role: Admin (Full Access)
```

## 📊 Database Schema

### Core Entities

#### Users
- Authentication and role management
- Roles: ADMIN, STAFF, ACCOUNTANT

#### Customers
- Customer information and credit status
- Unique phone number identification

#### Products
- **Phones**: IMEI-based tracking, battery health, buying source
- **Laptops**: Serial number tracking, specifications
- **Watches**: Serial number tracking
- **Accessories**: SKU-based, stock quantity management

#### Sales
- Complete sales records with customer and product linking
- Automatic stock updates and credit creation

#### Credits
- Outstanding payment tracking
- Due date management and reminder status

#### Expenses
- Business expense tracking by category
- Monthly expense aggregation

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/users` - Create user (Admin only)

### Customers
- `GET /api/customers` - List all customers
- `POST /api/customers` - Create customer
- `GET /api/customers/:id` - Get customer details
- `PUT /api/customers/:id` - Update customer

### Products
- `GET /api/products/phones` - List phones
- `POST /api/products/phones` - Add phone
- `GET /api/products/phones/:id` - Get phone details (public)
- `GET /api/products/laptops` - List laptops
- `POST /api/products/laptops` - Add laptop
- `GET /api/products/watches` - List watches
- `POST /api/products/watches` - Add watch
- `GET /api/products/accessories` - List accessories
- `POST /api/products/accessories` - Add accessory
- `PUT /api/products/accessories/:id` - Update accessory stock

### Sales
- `GET /api/sales` - List all sales
- `POST /api/sales` - Create sale
- `GET /api/sales/:id` - Get sale details

### Credits
- `GET /api/credits` - List all credits
- `PUT /api/credits/:id/payment` - Add payment to credit
- `GET /api/credits/overdue` - Get overdue credits

### Expenses
- `GET /api/expenses` - List all expenses
- `POST /api/expenses` - Add expense
- `GET /api/expenses/monthly/:year/:month` - Get monthly expenses

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/best-selling` - Get best selling products

## 👥 User Roles & Permissions

### Admin
- Full system access
- User management
- All CRUD operations
- System configuration

### Staff
- Customer management
- Product management
- Sales operations
- View reports

### Accountant
- Expense management
- Financial reports
- Dashboard access (limited)

## 🔔 Automated Features

### Credit Reminders
- Daily cron job at 9 AM
- Identifies overdue credits
- Updates reminder status
- Ready for SMS/Email integration

### Stock Management
- Automatic stock updates on sales
- Low stock alerts for accessories
- Product status management

### Profit Calculation
- Automatic monthly profit calculation
- Revenue - Purchase Cost - Expenses = Net Profit
- Real-time dashboard updates

## 🌐 Website Integration

The system provides public API endpoints for website integration:

### Public Phone Profiles
- `GET /api/products/phones/:id` - Public phone details
- No authentication required
- Perfect for website product pages

### Integration Architecture
```
Website (Frontend) → API Calls → CRM Backend → Database
```

## 🚀 Production Deployment

### Backend Deployment
1. Build the application: `npm run build`
2. Set environment variables:
   - `JWT_SECRET`: Strong secret key
   - `DATABASE_URL`: Production database URL
3. Run migrations: `npm run db:push`
4. Start production server: `npm start`

### Frontend Deployment
1. Update API base URL in `src/services/api.ts`
2. Build the application: `npm run build`
3. Deploy the `dist` folder to your hosting service

### Environment Variables
```bash
# Backend (.env)
JWT_SECRET=your-super-secret-jwt-key
DATABASE_URL=file:./production.db
PORT=3001

# Frontend
VITE_API_URL=https://your-api-domain.com/api
```

## 📈 Business Workflow

### Sales Process
1. **Add Products**: Add phones, laptops, watches, accessories
2. **Register Customers**: Create customer profiles
3. **Process Sales**: Select customer, product, set prices
4. **Automatic Updates**: Stock levels and product status update
5. **Credit Creation**: If partial payment, credit record created
6. **Reminders**: Automated reminders for overdue payments

### Monthly Operations
1. **Add Expenses**: Record all business expenses
2. **Review Dashboard**: Check sales, profit, credits
3. **Process Payments**: Update credit payments
4. **Generate Reports**: Monthly profit and loss analysis

## 🔧 Customization

### Adding New Product Types
1. Update Prisma schema in `server/prisma/schema.prisma`
2. Add new routes in `server/src/routes/products.ts`
3. Update frontend forms and tables
4. Run database migration

### Extending User Roles
1. Update `UserRole` enum in Prisma schema
2. Modify authentication middleware
3. Update frontend role checks
4. Adjust navigation permissions

### SMS/Email Integration
The reminder service is ready for integration:
- Update `server/src/services/reminderService.ts`
- Add your preferred SMS/Email service
- Configure API keys and templates

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error**
```bash
# Regenerate Prisma client
npm run db:generate
```

**Port Already in Use**
```bash
# Change port in server/src/index.ts
const PORT = process.env.PORT || 3002;
```

**CORS Issues**
- Update CORS configuration in `server/src/index.ts`
- Add your frontend domain to allowed origins

## 📞 Support

For technical support or feature requests:
1. Check the troubleshooting section
2. Review API documentation
3. Examine database schema
4. Test with provided sample data

## 📄 License

This project is proprietary software developed for mobile and accessories businesses.

---

**System Version**: 1.0.0  
**Last Updated**: December 2024  
**Compatibility**: Node.js 18+, Modern Browsers