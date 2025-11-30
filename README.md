\# 🛍️ Elysian Market - Fullstack Ecommerce Platform



A modern fullstack ecommerce application built with Django REST Framework backend and React frontend.



\## 🚀 Features



\### Backend (Django)

\- RESTful API with Django REST Framework

\- JWT Authentication

\- Product \& Inventory Management

\- Shopping Cart Functionality

\- Order Processing

\- User Reviews \& Ratings

\- Admin Dashboard



\### Frontend (React)

\- Modern React with Hooks

\- Responsive Design

\- Product Catalog with Search \& Filters

\- Shopping Cart

\- User Authentication

\- Order History

\- Product Reviews \& Ratings



\## 📁 Project Structure

```

ecommerce-fullstack/

├── backend/              # Django REST API

│   ├── ecommerce/       # Main Django project

│   ├── store/           # Ecommerce app

│   ├── manage.py

│   ├── requirements.txt

│   └── README.md

├── frontend/            # React Application

│   ├── public/

│   ├── src/

│   │   ├── components/

│   │   ├── pages/

│   │   ├── App.js

│   │   └── App.css

│   ├── package.json

│   └── README.md

└── README.md

```



\## 🛠️ Installation \& Setup



\### Prerequisites

\- Python 3.8+

\- Node.js 14+

\- PostgreSQL (optional, SQLite by default)



\### Backend Setup



1\. \*\*Navigate to backend directory:\*\*

```bash

&nbsp;  cd backend

```



2\. \*\*Create virtual environment:\*\*

```bash

&nbsp;  python -m venv venv

&nbsp;  source venv/bin/activate  # On Windows: venv\\Scripts\\activate

```



3\. \*\*Install dependencies:\*\*

```bash

&nbsp;  pip install -r requirements.txt

```



4\. \*\*Run migrations:\*\*

```bash

&nbsp;  python manage.py migrate

```



5\. \*\*Create superuser:\*\*

```bash

&nbsp;  python manage.py createsuperuser

```



6\. \*\*Start development server:\*\*

```bash

&nbsp;  python manage.py runserver

```

&nbsp;  Backend will run on http://localhost:8000



\### Frontend Setup



1\. \*\*Navigate to frontend directory:\*\*

```bash

&nbsp;  cd frontend

```



2\. \*\*Install dependencies:\*\*

```bash

&nbsp;  npm install

```



3\. \*\*Start development server:\*\*

```bash

&nbsp;  npm start

```

&nbsp;  Frontend will run on http://localhost:3000



\## 🔧 Configuration



\### Backend Environment Variables

Create `.env` file in `backend/` directory:

```env

DEBUG=True

SECRET\_KEY=your-secret-key

DATABASE\_URL=sqlite:///db.sqlite3

ALLOWED\_HOSTS=localhost,127.0.0.1

```



\### Frontend Configuration

Update API base URL in `frontend/src/App.js`:

```javascript

const API\_BASE\_URL = "http://localhost:8000";

```



\## 📚 API Endpoints



| Method | Endpoint | Description |

|--------|----------|-------------|

| POST | /api/login/ | User login |

| POST | /api/signup/ | User registration |

| GET | /api/products/ | Get all products |

| GET | /api/products/{id}/detail/ | Get product details |

| POST | /api/cart/add/ | Add to cart |

| GET | /api/cart/ | Get cart items |

| POST | /api/orders/create/ | Create order |



\## 🗃️ Database Models



\- \*\*User\*\* - Custom user model

\- \*\*Product\*\* - Product information

\- \*\*Cart\*\* - Shopping cart

\- \*\*Order\*\* - Order details

\- \*\*Review\*\* - Product reviews \& ratings



\## 🎨 Frontend Features



✅ User Authentication (Login/Signup)  

✅ Product Catalog with Search \& Filters  

✅ Shopping Cart Management  

✅ Order Processing  

✅ Product Reviews \& Ratings  

✅ Responsive Design  

✅ Admin Dashboard  



\## 🚀 Deployment



\### Backend Deployment (PythonAnywhere/Heroku)

```bash

\# Install production requirements

pip install -r requirements.txt



\# Collect static files

python manage.py collectstatic



\# Run migrations

python manage.py migrate

```



\### Frontend Deployment (Netlify/Vercel)

```bash

\# Build production version

npm run build

```



\## 🤝 Contributing



1\. Fork the repository

2\. Create your feature branch (`git checkout -b feature/AmazingFeature`)

3\. Commit your changes (`git commit -m 'Add some AmazingFeature'`)

4\. Push to the branch (`git push origin feature/AmazingFeature`)

5\. Open a Pull Request



\## 📝 License



This project is licensed under the MIT License - see the LICENSE file for details.



\## 👥 Authors



\- Your Name - \[Your GitHub](https://github.com/yourusername)



\## 🙏 Acknowledgments



\- Django REST Framework

\- React.js

\- Bootstrap for styling

