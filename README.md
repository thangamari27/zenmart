# Zenmart
A React-based Admin Simulation & Product Management project demonstrating product listing, dynamic search/sort, cart, wishlist, checkout, and order management using json-server and Firebase Google Authentication.

## 🧱 Folder Structure

```
Zenmart/
├── data/
│   └── db.json
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   └── products/
│   │       ├── ProductCard.jsx
│   │       ├── ProductGrid.jsx
│   │       └── SearchSortBar.jsx
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   └── ProductContext.jsx
│   ├── firebase/config.js
│   ├── hooks/useAddress.js
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ManageOrders.jsx
│   │   │   └── ManageProducts.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── OrderHistory.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Products.jsx
│   │   └── Wishlist.jsx
│   ├── services/productService.js
│   ├── utils/localStorage.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env
├── package.json
└── vite.config.js

```

## Installation

1. Clone the repository:
```
git clone https://github.com/your-username/zenmart.git
```

2. Install dependencies:
```
cd zenmart
npm install
```

3. Start the development server:
```
npm run dev
```

4. Start the mock JSON server:
```
npm run server
```

## Usage

1. Log in using Google authentication with Firebase.
2. Explore the features:
   - Product Management
   - Dynamic product listing with search and sorting
   - Cart and Wishlist
   - Checkout and Order History
   - Admin Simulation (manage products and orders)

## API

The project uses a mock REST API (json-server) to store product data, categories, and order information. The API endpoints are:

- `/products`: Get all products
- `/categories`: Get all product categories
- `/orders`: Get all orders

## Author

**Thangamari**
**Email**: thangamari616@gmail.com
**GitHub**: https://github.com/thangamari27/zenmart