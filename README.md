<div align="center">

# 🛍️ Elysian Market

### ✨ Modern Fullstack Ecommerce Platform ✨

[![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

**A powerful ecommerce solution built with Django REST Framework & React**

[🚀 Features](#-features) • [📦 Installation](#-installation--setup) • [🎯 API](#-api-endpoints) • [🤝 Contributing](#-contributing)

---

</div>

## 📖 About The Project

Elysian Market is a full-featured ecommerce platform designed for modern online retail. Built with a robust Django REST API backend and a sleek React frontend, it provides everything you need to launch and manage an online store.

### 🌟 Why Elysian Market?

- ⚡ **Fast & Responsive** - Optimized performance for seamless shopping experience
- 🔐 **Secure** - JWT authentication and secure payment processing
- 📱 **Mobile-First** - Beautiful responsive design that works on all devices
- 🛠️ **Developer-Friendly** - Clean code, well-documented, easy to customize

---

## 🚀 Features

<table>
<tr>
<td width="50%">

### 🔧 Backend (Django)

- ✅ RESTful API with Django REST Framework
- ✅ JWT Authentication & Authorization
- ✅ Product & Inventory Management
- ✅ Shopping Cart Functionality
- ✅ Order Processing & Tracking
- ✅ User Reviews & Ratings System
- ✅ Admin Dashboard
- ✅ Search & Filter Products
- ✅ Image Upload & Management

</td>
<td width="50%">

### 🎨 Frontend (React)

- ✅ Modern React with Hooks
- ✅ Responsive Material Design
- ✅ Product Catalog with Filters
- ✅ Real-time Cart Updates
- ✅ User Authentication Flow
- ✅ Order History & Tracking
- ✅ Product Reviews & Ratings
- ✅ Wishlist Functionality
- ✅ Search Autocomplete

</td>
</tr>
</table>

---

## 📁 Project Structure
```
ecommerce-fullstack/
│
├── 🔙 backend/              # Django REST API
│   ├── ecommerce_project/   # Main Django project
│   │   ├── settings.py      # Project settings
│   │   ├── urls.py          # URL routing
│   │   └── wsgi.py          # WSGI config
│   ├── store/               # Ecommerce app
│   │   ├── models.py        # Database models
│   │   ├── views.py         # API views
│   │   ├── serializers.py   # DRF serializers
│   │   └── urls.py          # App URLs
│   ├── manage.py
│   ├── requirements.txt
│   └── README.md
│
├── 🎨 frontend/             # React Application
│   ├── public/              # Static files
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── App.js           # Main App component
│   │   ├── App.css          # Global styles
│   │   └── index.js         # Entry point
│   ├── package.json
│   └── README.md
│
├── .gitignore
└── README.md                # You are here! 📍
```

---

## 🛠️ Installation & Setup

### 📋 Prerequisites

Before you begin, ensure you have the following installed:

- ![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=flat-square&logo=python&logoColor=white)
- ![Node.js](https://img.shields.io/badge/Node.js-14+-339933?style=flat-square&logo=node.js&logoColor=white)
- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Optional-316192?style=flat-square&logo=postgresql&logoColor=white)

### 🔙 Backend Setup
```bash
# 1️⃣ Navigate to backend directory
cd backend

# 2️⃣ Create virtual environment
python -m venv venv

# 3️⃣ Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# 4️⃣ Install dependencies
pip install -r requirements.txt

# 5️⃣ Run migrations
python manage.py migrate

# 6️⃣ Create superuser (admin account)
python manage.py createsuperuser

# 7️⃣ Start development server
python manage.py runserver
```

✅ Backend will run on **http://localhost:8000**

### 🎨 Frontend Setup
```bash
# 1️⃣ Navigate to frontend directory
cd frontend

# 2️⃣ Install dependencies
npm install

# 3️⃣ Start development server
npm start
```

✅ Frontend will run on **http://localhost:3000**

---

## ⚙️ Configuration

### 🔐 Backend Environment Variables

Create a `.env` file in the `backend/` directory:
```env
DEBUG=True
SECRET_KEY=your-super-secret-key-here
DATABASE_URL=sqlite:///db.sqlite3
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000

# Optional: PostgreSQL Database
# DATABASE_URL=postgresql://user:password@localhost:5432/elysian_db

# Email Configuration (Optional)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

### 🎨 Frontend Configuration

Update API base URL in `frontend/src/App.js`:
```javascript
const API_BASE_URL = "http://localhost:8000";
```

---

## 📚 API Endpoints

### 🔐 Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/signup/` | Register new user |
| `POST` | `/api/login/` | User login (returns JWT token) |
| `POST` | `/api/logout/` | User logout |
| `GET` | `/api/user/profile/` | Get user profile |

### 🛍️ Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products/` | Get all products |
| `GET` | `/api/products/{id}/` | Get product details |
| `POST` | `/api/products/` | Create product (Admin) |
| `PUT` | `/api/products/{id}/` | Update product (Admin) |
| `DELETE` | `/api/products/{id}/` | Delete product (Admin) |

### 🛒 Shopping Cart

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/cart/` | Get cart items |
| `POST` | `/api/cart/add/` | Add item to cart |
| `PUT` | `/api/cart/{id}/update/` | Update cart item |
| `DELETE` | `/api/cart/{id}/remove/` | Remove from cart |

### 📦 Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/orders/` | Get user orders |
| `GET` | `/api/orders/{id}/` | Get order details |
| `POST` | `/api/orders/create/` | Create new order |
| `PUT` | `/api/orders/{id}/status/` | Update order status (Admin) |

### ⭐ Reviews

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products/{id}/reviews/` | Get product reviews |
| `POST` | `/api/reviews/create/` | Create review |
| `PUT` | `/api/reviews/{id}/` | Update review |
| `DELETE` | `/api/reviews/{id}/` | Delete review |

---

## 🗃️ Database Models

### 👤 User Model
- Custom user model with email authentication
- Fields: username, email, password, phone, address

### 📦 Product Model
- name, description, price, stock, category
- image, created_at, updated_at
- average_rating, review_count

### 🛒 Cart Model
- user, product, quantity
- created_at, updated_at

### 📋 Order Model
- user, products, total_amount
- status (pending, processing, shipped, delivered)
- shipping_address, payment_method
- created_at, updated_at

### ⭐ Review Model
- user, product, rating (1-5)
- comment, created_at, updated_at

---

## 🎨 Screenshots

<div align="center">

### 🏠 Home Page
![Home Page](https://via.placeholder.com/800x400/4A90E2/FFFFFF?text=Home+Page+Screenshot)

### 🛍️ Product Catalog
![Products](https://via.placeholder.com/800x400/50C878/FFFFFF?text=Product+Catalog+Screenshot)

### 🛒 Shopping Cart
![Cart](https://via.placeholder.com/800x400/FF6B6B/FFFFFF?text=Shopping+Cart+Screenshot)

</div>

---

## 🚀 Deployment

### 🔙 Backend Deployment

#### Heroku / Render
```bash
# Install production dependencies
pip install -r requirements.txt gunicorn

# Collect static files
python manage.py collectstatic --noinput

# Run migrations
python manage.py migrate

# Start with Gunicorn
gunicorn ecommerce_project.wsgi:application
```

#### PythonAnywhere

1. Upload your code
2. Create virtual environment
3. Install requirements
4. Set up WSGI configuration
5. Configure static files

### 🎨 Frontend Deployment

#### Netlify / Vercel
```bash
# Build production version
npm run build

# Deploy the 'build' folder
```

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm test
```

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place! Any contributions you make are **greatly appreciated**.

1. 🍴 Fork the Project
2. 🔀 Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. ✅ Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. 📤 Push to the Branch (`git push origin feature/AmazingFeature`)
5. 🎉 Open a Pull Request

---

## 🐛 Bug Reports & Feature Requests

Found a bug? Have a feature request? Please [open an issue](https://github.com/yourusername/ecommerce-fullstack/issues) with detailed information.

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Authors

<div align="center">
**Aditya Choudhuri**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/AdityaC-07)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/aditya-choudhuri-87a2a034a)

</div>

---

## 🙏 Acknowledgments

- [Django REST Framework](https://www.django-rest-framework.org/) - Powerful toolkit for building Web APIs
- [React](https://reactjs.org/) - JavaScript library for building user interfaces
- [Bootstrap](https://getbootstrap.com/) - Frontend framework for responsive design
- [Font Awesome](https://fontawesome.com/) - Icon library
- [Unsplash](https://unsplash.com/) - Free high-quality images

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

![Visitors](https://visitor-badge.laobi.icu/badge?page_id=yourusername.ecommerce-fullstack)

</div>
