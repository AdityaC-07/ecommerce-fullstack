import React, { useState, useEffect } from "react";
import "./App.css";

const API_BASE_URL = "http://localhost:8000";

function App() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(true);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showAdminOrders, setShowAdminOrders] = useState(false);
  const [cart, setCart] = useState({ items: [], total_items: 0, total_price: 0 });
  const [orders, setOrders] = useState([]);
  const [adminOrders, setAdminOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // ✅ Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("");

  // ✅ Additional Pages
  const [showSignup, setShowSignup] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);

  // ✅ NEW: Product Details & Reviews States
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productReviews, setProductReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    review_text: ""
  });

  // ✅ Form States
  const [signupForm, setSignupForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: ""
  });

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    available: true,
    category: "other",
    image: null
  });

  const [checkoutForm, setCheckoutForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    payment_method: "Cash on Delivery"
  });

  // Check if user is already logged in
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/check-auth/`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        console.log("✅ Auth check:", data);
        if (data.username) {
          setUser(data.username);
          setIsAdmin(data.is_staff || false);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Auth check error:", err);
        setLoading(false);
      });
  }, []);

  // Fetch products and cart when user logs in
  useEffect(() => {
    if (user) {
      console.log("👤 User logged in:", user, "isAdmin:", isAdmin);
      fetchProducts();
      fetchCart();
      if (!isAdmin) {
        fetchOrders();
      } else {
        fetchAdminOrders();
      }
    }
  }, [user]);

  // Fetch products with search, filter, and sort
  const fetchProducts = (search = "", category = "all", sort = "") => {
    let url = `${API_BASE_URL}/api/products/?`;
    
    if (search) {
      url += `search=${encodeURIComponent(search)}&`;
    }
    if (category && category !== "all") {
      url += `category=${category}&`;
    }
    if (sort) {
      url += `sort=${sort}`;
    }
    
    console.log("📦 Fetching products with URL:", url);
    
    fetch(url, {
      credentials: "include"
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Products fetched:", data);
        setProducts(data);
      })
      .catch((err) => console.error("❌ Error fetching products:", err));
  };

  // ✅ NEW: Fetch product details
  const fetchProductDetail = (productId) => {
    fetch(`${API_BASE_URL}/api/products/${productId}/detail/`, {
      credentials: "include"
    })
      .then((res) => res.json())
      .then((data) => {
        setSelectedProduct(data);
        setProductReviews(data.reviews || []);
        setShowProductDetail(true);
        // Hide other views
        setShowCart(false);
        setShowCheckout(false);
        setShowOrders(false);
        setShowAdminPanel(false);
        setShowAdminOrders(false);
        setShowAbout(false);
        setShowContact(false);
      })
      .catch((err) => console.error("Error fetching product detail:", err));
  };

  // ✅ NEW: Submit review
  const handleSubmitReview = (e) => {
    e.preventDefault();
    
    fetch(`${API_BASE_URL}/api/products/${selectedProduct.id}/review/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewForm),
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          alert("✅ " + data.message);
          setReviewForm({ rating: 5, review_text: "" });
          fetchProductDetail(selectedProduct.id); // Refresh product details
        } else {
          alert("❌ " + (data.error || "Failed to submit review"));
        }
      })
      .catch(err => {
        console.error("Error submitting review:", err);
        alert("Failed to submit review");
      });
  };

  // ✅ NEW: Delete review
  const handleDeleteReview = (reviewId) => {
    if (window.confirm("Delete this review?")) {
      fetch(`${API_BASE_URL}/api/reviews/${reviewId}/delete/`, {
        method: "DELETE",
        credentials: "include"
      })
        .then(res => res.json())
        .then(data => {
          if (data.message) {
            alert("✅ " + data.message);
            fetchProductDetail(selectedProduct.id);
          } else {
            alert("❌ " + (data.error || "Failed to delete review"));
          }
        })
        .catch(err => {
          console.error("Error deleting review:", err);
          alert("Failed to delete review");
        });
    }
  };

  const fetchCart = () => {
    console.log("🛒 Fetching cart...");
    fetch(`${API_BASE_URL}/api/cart/`, {
      credentials: "include"
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Cart fetched:", data);
        setCart(data);
      })
      .catch((err) => console.error("❌ Error fetching cart:", err));
  };

  const fetchOrders = () => {
    fetch(`${API_BASE_URL}/api/orders/`, {
      credentials: "include"
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders || []);
      })
      .catch((err) => console.error("Error fetching orders:", err));
  };

  const fetchAdminOrders = () => {
    fetch(`${API_BASE_URL}/api/admin/orders/`, {
      credentials: "include"
    })
      .then((res) => res.json())
      .then((data) => {
        setAdminOrders(data.orders || []);
      })
      .catch((err) => console.error("Error fetching admin orders:", err));
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(searchQuery, selectedCategory, sortBy);
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    fetchProducts(searchQuery, category, sortBy);
  };

  // Handle sort change
  const handleSortChange = (sort) => {
    setSortBy(sort);
    fetchProducts(searchQuery, selectedCategory, sort);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSortBy("");
    fetchProducts("", "all", "");
  };

  // Handle Sign Up
  const handleSignup = (e) => {
    e.preventDefault();
    
    fetch(`${API_BASE_URL}/api/signup/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signupForm),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          alert("✅ " + data.message);
          setUser(data.username);
          setIsAdmin(data.is_staff || false);
          setShowSignup(false);
          setSignupForm({ username: "", email: "", password: "", confirm_password: "" });
        } else {
          alert("❌ " + (data.error || "Signup failed"));
        }
      })
      .catch(err => {
        console.error("Signup error:", err);
        alert("Signup failed");
      });
  };

  // Handle Contact Form
  const handleContactSubmit = (e) => {
    e.preventDefault();
    
    fetch(`${API_BASE_URL}/api/contact/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contactForm),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          alert("✅ " + data.message);
          setContactForm({ name: "", email: "", subject: "", message: "" });
        } else {
          alert("❌ " + (data.error || "Failed to send message"));
        }
      })
      .catch(err => {
        console.error("Contact error:", err);
        alert("Failed to send message");
      });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("🔐 Logging in...");
    fetch(`${API_BASE_URL}/api/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Login response:", data);
        if (data.username) {
          setUser(data.username);
          setIsAdmin(data.is_staff || false);
        } else {
          alert(data.error || "Login failed");
        }
      })
      .catch(err => {
        console.error("❌ Login error:", err);
        alert("Login failed");
      });
  };

  const handleLogout = () => {
    console.log("🚪 Logging out...");
    fetch(`${API_BASE_URL}/api/logout/`, { 
      credentials: "include" 
    })
      .then(() => {
        setUser(null);
        setIsAdmin(false);
        setProducts([]);
        setCart({ items: [], total_items: 0, total_price: 0 });
        setOrders([]);
        setAdminOrders([]);
        setShowAdminPanel(false);
        setShowCart(false);
        setShowCheckout(false);
        setShowOrders(false);
        setShowAdminOrders(false);
        setShowAbout(false);
        setShowContact(false);
        setShowProductDetail(false); // ✅ NEW
        setSelectedProduct(null); // ✅ NEW
        setSearchQuery("");
        setSelectedCategory("all");
        setSortBy("");
      });
  };

  const handleImageChange = (e) => {
    setProductForm({
      ...productForm,
      image: e.target.files[0]
    });
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append('name', productForm.name);
    formDataToSend.append('description', productForm.description);
    formDataToSend.append('price', productForm.price);
    formDataToSend.append('stock', productForm.stock);
    formDataToSend.append('available', productForm.available);
    formDataToSend.append('category', productForm.category);
    if (productForm.image) {
      formDataToSend.append('image', productForm.image);
    }

    fetch(`${API_BASE_URL}/api/products/add/`, {
      method: "POST",
      body: formDataToSend,
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          alert("✅ Product added successfully!");
          setProductForm({ 
            name: "", 
            description: "", 
            price: "", 
            stock: "", 
            available: true, 
            category: "other",
            image: null 
          });
          fetchProducts(searchQuery, selectedCategory, sortBy);
          setShowAdminPanel(false);
        } else {
          alert("❌ " + (data.error || "Failed to add product"));
        }
      })
      .catch(err => {
        console.error("Error adding product:", err);
        alert("Failed to add product");
      });
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      fetch(`${API_BASE_URL}/api/products/delete/${productId}/`, {
        method: "DELETE",
        credentials: "include"
      })
        .then(res => res.json())
        .then(data => {
          if (data.message) {
            alert("Product deleted successfully!");
            fetchProducts(searchQuery, selectedCategory, sortBy);
          } else {
            alert(data.error || "Failed to delete product");
          }
        })
        .catch(err => {
          console.error("Error deleting product:", err);
          alert("Failed to delete product");
        });
    }
  };

  const handleAddToCart = (productId) => {
    console.log("🛒🛒🛒 ADD TO CART FUNCTION CALLED!");
    console.log("Product ID:", productId);
    console.log("User:", user);
    console.log("Is Admin:", isAdmin);
    
    if (!user) {
      alert("Please login first!");
      return;
    }

    if (isAdmin) {
      alert("Admin cannot add to cart!");
      return;
    }
    
    fetch(`${API_BASE_URL}/api/cart/add/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId, quantity: 1 }),
      credentials: "include"
    })
      .then(res => {
        console.log("📡 Response status:", res.status);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log("📦 Response data:", data);
        if (data.message) {
          alert("✅ " + data.message);
          fetchCart();
        } else {
          alert("❌ " + (data.error || "Failed to add to cart"));
        }
      })
      .catch(err => {
        console.error("❌ Error adding to cart:", err);
        alert("Failed to add to cart: " + err.message);
      });
  };

  const handleUpdateCartItem = (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    fetch(`${API_BASE_URL}/api/cart/update/${itemId}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: newQuantity }),
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          fetchCart();
        } else {
          alert("❌ " + (data.error || "Failed to update cart"));
        }
      })
      .catch(err => {
        console.error("Error updating cart:", err);
        alert("Failed to update cart");
      });
  };

  const handleRemoveFromCart = (itemId) => {
    if (window.confirm("Remove this item from cart?")) {
      fetch(`${API_BASE_URL}/api/cart/remove/${itemId}/`, {
        method: "DELETE",
        credentials: "include"
      })
        .then(res => res.json())
        .then(data => {
          if (data.message) {
            alert("✅ " + data.message);
            fetchCart();
          } else {
            alert("❌ " + (data.error || "Failed to remove from cart"));
          }
        })
        .catch(err => {
          console.error("Error removing from cart:", err);
          alert("Failed to remove from cart");
        });
    }
  };

  const handleProceedToCheckout = () => {
    if (cart.items.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    setShowCart(false);
    setShowCheckout(true);
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    fetch(`${API_BASE_URL}/api/orders/create/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(checkoutForm),
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          alert(`✅ ${data.message}\nOrder Number: ${data.order_number}`);
          setCheckoutForm({
            full_name: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            state: "",
            pincode: "",
            payment_method: "Cash on Delivery"
          });
          fetchCart();
          fetchOrders();
          setShowCheckout(false);
          setShowOrders(true);
        } else {
          alert("❌ " + (data.error || "Failed to place order"));
        }
      })
      .catch(err => {
        console.error("Error placing order:", err);
        alert("Failed to place order");
      });
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    fetch(`${API_BASE_URL}/api/admin/orders/${orderId}/status/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          alert("✅ " + data.message);
          fetchAdminOrders();
        } else {
          alert("❌ " + (data.error || "Failed to update status"));
        }
      })
      .catch(err => {
        console.error("Error updating order status:", err);
        alert("Failed to update status");
      });
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="header">
        <h1>🛍️ Elysian Market</h1>
        {user && (
          <div className="user-info">
            <span className="welcome-text">
              Welcome, {user}! {isAdmin && "👑"}
            </span>
            {!isAdmin && (
              <>
                <button 
                  onClick={() => {
                    setShowOrders(!showOrders);
                    setShowCart(false);
                    setShowCheckout(false);
                    setShowAdminPanel(false);
                    setShowAdminOrders(false);
                    setShowAbout(false);
                    setShowContact(false);
                    setShowProductDetail(false); // ✅ NEW
                  }} 
                  className="btn-orders"
                >
                  📦 Orders
                </button>
                <button 
                  onClick={() => {
                    setShowCart(!showCart);
                    setShowOrders(false);
                    setShowCheckout(false);
                    setShowAdminPanel(false);
                    setShowAdminOrders(false);
                    setShowAbout(false);
                    setShowContact(false);
                    setShowProductDetail(false); // ✅ NEW
                  }} 
                  className="btn-cart"
                >
                  🛒 Cart ({cart.total_items})
                </button>
              </>
            )}
            {isAdmin && (
              <>
                <button 
                  onClick={() => {
                    setShowAdminOrders(!showAdminOrders);
                    setShowAdminPanel(false);
                    setShowCart(false);
                    setShowCheckout(false);
                    setShowOrders(false);
                    setShowAbout(false);
                    setShowContact(false);
                    setShowProductDetail(false); // ✅ NEW
                  }} 
                  className="btn-admin-orders"
                >
                  📋 Manage Orders
                </button>
                <button 
                  onClick={() => {
                    setShowAdminPanel(!showAdminPanel);
                    setShowAdminOrders(false);
                    setShowCart(false);
                    setShowCheckout(false);
                    setShowOrders(false);
                    setShowAbout(false);
                    setShowContact(false);
                    setShowProductDetail(false); // ✅ NEW
                  }} 
                  className="btn-admin"
                >
                  {showAdminPanel ? "View Products" : "Add Product"}
                </button>
              </>
            )}
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </div>
        )}
      </header>

      {!user ? (
        showSignup ? (
          // Sign Up Page
          <div className="login-container">
            <div className="login-box">
              <div className="login-icon">✨</div>
              <h2>Create Account</h2>
              <p className="login-subtitle">Join us today and start shopping!</p>
              <form onSubmit={handleSignup}>
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Username"
                    value={signupForm.username}
                    onChange={(e) =>
                      setSignupForm({ ...signupForm, username: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="input-group">
                  <input
                    type="email"
                    placeholder="Email"
                    value={signupForm.email}
                    onChange={(e) =>
                      setSignupForm({ ...signupForm, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="input-group">
                  <input
                    type="password"
                    placeholder="Password (min 6 characters)"
                    value={signupForm.password}
                    onChange={(e) =>
                      setSignupForm({ ...signupForm, password: e.target.value })
                    }
                    required
                    minLength="6"
                  />
                </div>
                <div className="input-group">
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={signupForm.confirm_password}
                    onChange={(e) =>
                      setSignupForm({ ...signupForm, confirm_password: e.target.value })
                    }
                    required
                  />
                </div>
                <button type="submit" className="btn-login">
                  Sign Up
                </button>
              </form>
              <p className="switch-form">
                Already have an account?{" "}
                <button onClick={() => setShowSignup(false)} className="link-button">
                  Sign In
                </button>
              </p>
            </div>
          </div>
        ) : (
          // Login Page
          <div className="login-container">
            <div className="login-box">
              <div className="login-icon">🔐</div>
              <h2>Sign In</h2>
              <p className="login-subtitle">Enter your credentials to continue</p>
              <form onSubmit={handleLogin}>
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="input-group">
                  <input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                </div>
                <button type="submit" className="btn-login">
                  Sign In
                </button>
              </form>
              <p className="switch-form">
                Don't have an account?{" "}
                <button onClick={() => setShowSignup(true)} className="link-button">
                  Sign Up
                </button>
              </p>
            </div>
          </div>
        )
      ) : showProductDetail && selectedProduct ? (
        // ✅ NEW: Product Detail Page
        <div className="product-detail-container">
          <div className="product-detail-content">
            <button onClick={() => setShowProductDetail(false)} className="btn-back">
              ← Back to Products
            </button>

            <div className="product-detail-layout">
              {/* Product Image & Info */}
              <div className="product-detail-left">
                <div className="product-detail-image">
                  <img src={selectedProduct.image} alt={selectedProduct.name} />
                  <span className="product-category-badge">{selectedProduct.category}</span>
                </div>
              </div>

              <div className="product-detail-right">
                <h1>{selectedProduct.name}</h1>
                
                {/* Rating Display */}
                <div className="rating-display">
                  <div className="stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className={star <= selectedProduct.average_rating ? "star filled" : "star"}>
                        ⭐
                      </span>
                    ))}
                  </div>
                  <span className="rating-text">
                    {selectedProduct.average_rating.toFixed(1)} ({selectedProduct.review_count} reviews)
                  </span>
                </div>

                <p className="product-price-large">₹{selectedProduct.price}</p>

                <div className="product-stock-info">
                  {selectedProduct.available && selectedProduct.stock > 0 ? (
                    <span className="in-stock-large">✓ In Stock ({selectedProduct.stock} available)</span>
                  ) : (
                    <span className="out-of-stock-large">✗ Out of Stock</span>
                  )}
                </div>

                <div className="product-description-section">
                  <h3>Description</h3>
                  <p>{selectedProduct.description}</p>
                </div>

                {!isAdmin && (
                  <div className="product-actions-large">
                    <button 
                      className="btn-add-to-cart-large"
                      disabled={!selectedProduct.available || selectedProduct.stock === 0}
                      onClick={() => {
                        handleAddToCart(selectedProduct.id);
                        setShowProductDetail(false);
                      }}
                    >
                      {selectedProduct.available && selectedProduct.stock > 0 ? "🛒 Add to Cart" : "Out of Stock"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="reviews-section">
              <h2>Customer Reviews</h2>

              {/* Add Review Form (Customers Only) */}
              {!isAdmin && (
                <div className="add-review-form">
                  <h3>Write a Review</h3>
                  <form onSubmit={handleSubmitReview}>
                    <div className="rating-input">
                      <label>Your Rating:</label>
                      <div className="star-rating-input">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={star <= reviewForm.rating ? "star-input active" : "star-input"}
                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          >
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="input-group">
                      <label>Your Review:</label>
                      <textarea
                        placeholder="Share your experience with this product..."
                        value={reviewForm.review_text}
                        onChange={(e) =>
                          setReviewForm({ ...reviewForm, review_text: e.target.value })
                        }
                        required
                        rows="4"
                      />
                    </div>
                    <button type="submit" className="btn-submit-review">
                      Submit Review
                    </button>
                  </form>
                </div>
              )}

              {/* Reviews List */}
              <div className="reviews-list">
                {productReviews.length === 0 ? (
                  <p className="no-reviews">No reviews yet. Be the first to review!</p>
                ) : (
                  productReviews.map((review) => (
                    <div key={review.id} className="review-card">
                      <div className="review-header">
                        <div>
                          <strong>{review.username}</strong>
                          <div className="review-stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star} className={star <= review.rating ? "star filled" : "star"}>
                                ⭐
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="review-meta">
                          <span className="review-date">
                            {new Date(review.created_at).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                          {(review.username === user || isAdmin) && (
                            <button 
                              onClick={() => handleDeleteReview(review.id)}
                              className="btn-delete-review"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="review-text">{review.review_text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : showCheckout ? (
        // Checkout Page
        <div className="checkout-container">
          <div className="checkout-content">
            <h2>📦 Checkout</h2>
            <div className="checkout-layout">
              <div className="checkout-form-section">
                <h3>Shipping Information</h3>
                <form onSubmit={handlePlaceOrder}>
                  <div className="input-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={checkoutForm.full_name}
                      onChange={(e) =>
                        setCheckoutForm({ ...checkoutForm, full_name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={checkoutForm.email}
                      onChange={(e) =>
                        setCheckoutForm({ ...checkoutForm, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label>Phone *</label>
                    <input
                      type="tel"
                      placeholder="Enter your phone number"
                      value={checkoutForm.phone}
                      onChange={(e) =>
                        setCheckoutForm({ ...checkoutForm, phone: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label>Address *</label>
                    <textarea
                      placeholder="Enter your full address"
                      value={checkoutForm.address}
                      onChange={(e) =>
                        setCheckoutForm({ ...checkoutForm, address: e.target.value })
                      }
                      required
                      rows="3"
                    />
                  </div>
                  <div className="input-row">
                    <div className="input-group">
                      <label>City *</label>
                      <input
                        type="text"
                        placeholder="City"
                        value={checkoutForm.city}
                        onChange={(e) =>
                          setCheckoutForm({ ...checkoutForm, city: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="input-group">
                      <label>State *</label>
                      <input
                        type="text"
                        placeholder="State"
                        value={checkoutForm.state}
                        onChange={(e) =>
                          setCheckoutForm({ ...checkoutForm, state: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Pincode *</label>
                    <input
                      type="text"
                      placeholder="Enter pincode"
                      value={checkoutForm.pincode}
                      onChange={(e) =>
                        setCheckoutForm({ ...checkoutForm, pincode: e.target.value })
                      }
                      required
                      maxLength="6"
                    />
                  </div>
                  <div className="input-group">
                    <label>Payment Method</label>
                    <select
                      value={checkoutForm.payment_method}
                      onChange={(e) =>
                        setCheckoutForm({ ...checkoutForm, payment_method: e.target.value })
                      }
                    >
                      <option value="Cash on Delivery">Cash on Delivery</option>
                    </select>
                  </div>
                  <div className="checkout-actions">
                    <button type="submit" className="btn-place-order">
                      Place Order
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        setShowCheckout(false);
                        setShowCart(true);
                      }} 
                      className="btn-back-to-cart"
                    >
                      Back to Cart
                    </button>
                  </div>
                </form>
              </div>
              <div className="order-summary-section">
                <h3>Order Summary</h3>
                <div className="summary-items">
                  {cart.items.map((item) => (
                    <div key={item.id} className="summary-item">
                      <img src={item.product.image} alt={item.product.name} />
                      <div className="summary-item-details">
                        <p className="summary-item-name">{item.product.name}</p>
                        <p className="summary-item-qty">Qty: {item.quantity}</p>
                      </div>
                      <p className="summary-item-price">₹{item.subtotal}</p>
                    </div>
                  ))}
                </div>
                <div className="summary-total">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>₹{cart.total_price}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping:</span>
                    <span>FREE</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>₹{cart.total_price}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : showOrders ? (
        // Orders Page
        <div className="orders-container">
          <div className="orders-content">
            <h2>📦 My Orders</h2>
            {orders.length === 0 ? (
              <div className="empty-orders">
                <p>No orders yet</p>
                <button 
                  onClick={() => setShowOrders(false)} 
                  className="btn-continue"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div>
                        <h3>Order #{order.order_number}</h3>
                        <p className="order-date">
                          {new Date(order.created_at).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <span className={`order-status status-${order.status}`}>
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="order-items">
                      {order.items.map((item) => (
                        <div key={item.id} className="order-item">
                          <img src={item.product_image} alt={item.product_name} />
                          <div className="order-item-details">
                            <p className="order-item-name">{item.product_name}</p>
                            <p className="order-item-qty">Quantity: {item.quantity}</p>
                            <p className="order-item-price">₹{item.price} each</p>
                          </div>
                          <p className="order-item-subtotal">₹{item.subtotal}</p>
                        </div>
                      ))}
                    </div>
                    <div className="order-footer">
                      <div className="order-address">
                        <strong>Shipping Address:</strong>
                        <p>{order.full_name}</p>
                        <p>{order.address}, {order.city}, {order.state} - {order.pincode}</p>
                      </div>
                      <div className="order-total">
                        <strong>Total Amount:</strong>
                        <p className="order-total-amount">₹{order.total_amount}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : showAdminOrders && isAdmin ? (
        // Admin Orders Management
        <div className="admin-orders-container">
          <div className="admin-orders-content">
            <h2>👑 Manage All Orders</h2>
            {adminOrders.length === 0 ? (
              <div className="empty-orders">
                <p>No orders yet</p>
              </div>
            ) : (
              <div className="admin-orders-list">
                {adminOrders.map((order) => (
                  <div key={order.id} className="admin-order-card">
                    <div className="admin-order-header">
                      <div className="admin-order-info">
                        <h3>Order #{order.order_number}</h3>
                        <p className="order-date">
                          {new Date(order.created_at).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <p className="order-customer">
                          👤 Customer: <strong>{order.username}</strong> ({order.full_name})
                        </p>
                      </div>
                      <div className="admin-order-status-section">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className={`order-status-select status-${order.status}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="admin-order-details">
                      <div className="admin-order-column">
                        <h4>📧 Contact Information</h4>
                        <p><strong>Email:</strong> {order.email}</p>
                        <p><strong>Phone:</strong> {order.phone}</p>
                        <p><strong>Payment:</strong> {order.payment_method}</p>
                      </div>
                      
                      <div className="admin-order-column">
                        <h4>📦 Order Details</h4>
                        <p><strong>Items:</strong> {order.item_count} items</p>
                        <p><strong>Total Amount:</strong> <span className="order-amount">₹{order.total_amount}</span></p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                      className="btn-view-details"
                    >
                      {selectedOrder === order.id ? "Hide Details ▲" : "View Full Details ▼"}
                    </button>
                    
                    {selectedOrder === order.id && (
                      <div className="admin-order-full-details">
                        <div className="shipping-address">
                          <h4>🏠 Shipping Address</h4>
                          <p>{order.full_name}</p>
                          <p>{order.address}</p>
                          <p>{order.city}, {order.state} - {order.pincode}</p>
                          <p>Email: {order.email}</p>
                          <p>Phone: {order.phone}</p>
                        </div>
                        <div className="order-items-admin">
                          <h4>🛒 Order Items</h4>
                          <p className="note">Note: Full item details will appear after customer places order with items</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : showAbout ? (
        // About Us Page
        <div className="static-page-container">
          <div className="static-page-content">
            <h1>About Elysian Market</h1>
            
            <div className="about-hero">
              <p className="lead">
                Welcome to Elysian Market - where quality meets elegance. We're redefining online shopping 
                with curated products and exceptional service.
              </p>
            </div>

            <div className="about-section">
              <h2>Our Story</h2>
              <p>
                Founded in 2025, Elysian Market was born from a simple idea: shopping should be an 
                experience, not just a transaction. We carefully select each product in our collection 
                to ensure it meets our high standards of quality, design, and sustainability.
              </p>
            </div>

            <div className="about-section">
              <h2>Our Mission</h2>
              <p>
                To provide a seamless shopping experience that combines modern technology with timeless 
                elegance. We believe in quality over quantity, sustainability over trends, and customer 
                satisfaction above all.
              </p>
            </div>

            <div className="about-values">
              <h2>Our Values</h2>
              <div className="values-grid">
                <div className="value-card">
                  <span className="value-icon">✨</span>
                  <h3>Quality First</h3>
                  <p>Every product is carefully curated to ensure the highest standards.</p>
                </div>
                <div className="value-card">
                  <span className="value-icon">🌿</span>
                  <h3>Sustainability</h3>
                  <p>We prioritize eco-friendly products and sustainable practices.</p>
                </div>
                <div className="value-card">
                  <span className="value-icon">🤝</span>
                  <h3>Customer First</h3>
                  <p>Your satisfaction and trust are our top priorities.</p>
                </div>
                <div className="value-card">
                  <span className="value-icon">🚀</span>
                  <h3>Innovation</h3>
                  <p>Constantly evolving to provide the best shopping experience.</p>
                </div>
              </div>
            </div>

            <div className="about-section">
              <h2>Why Choose Us?</h2>
              <ul className="feature-list">
                <li>✓ Carefully curated product selection</li>
                <li>✓ Secure and easy checkout process</li>
                <li>✓ Fast and reliable delivery</li>
                <li>✓ Exceptional customer support</li>
                <li>✓ Easy returns and exchanges</li>
                <li>✓ Competitive pricing</li>
              </ul>
            </div>

            <button onClick={() => setShowAbout(false)} className="btn-back">
              ← Back to Shopping
            </button>
          </div>
        </div>
      ) : showContact ? (
        // Contact Us Page
        <div className="static-page-container">
          <div className="static-page-content">
            <h1>Contact Us</h1>
            <p className="lead">Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>

            <div className="contact-layout">
              <div className="contact-form-section">
                <h2>Send us a Message</h2>
                <form onSubmit={handleContactSubmit} className="contact-form">
                  <div className="input-group">
                    <label>Your Name *</label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={contactForm.name}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={contactForm.email}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label>Subject *</label>
                    <input
                      type="text"
                      placeholder="What is this about?"
                      value={contactForm.subject}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, subject: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label>Message *</label>
                    <textarea
                      placeholder="Tell us more..."
                      value={contactForm.message}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, message: e.target.value })
                      }
                      required
                      rows="6"
                    />
                  </div>
                  <button type="submit" className="btn-submit">
                    Send Message
                  </button>
                </form>
              </div>

              <div className="contact-info-section">
                <h2>Get in Touch</h2>
                <div className="contact-info-card">
                  <div className="contact-item">
                    <span className="contact-icon">📧</span>
                    <div>
                      <h4>Email</h4>
                      <p>support@elysianmarket.com</p>
                    </div>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">📞</span>
                    <div>
                      <h4>Phone</h4>
                      <p>+91 98765 43210</p>
                    </div>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">📍</span>
                    <div>
                      <h4>Address</h4>
                      <p>123 Market Street<br/>Mumbai, Maharashtra 400001<br/>India</p>
                    </div>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">🕒</span>
                    <div>
                      <h4>Business Hours</h4>
                      <p>Monday - Friday: 9 AM - 6 PM<br/>Saturday: 10 AM - 4 PM<br/>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button onClick={() => setShowContact(false)} className="btn-back">
              ← Back to Shopping
            </button>
          </div>
        </div>
      ) : showCart ? (
        // Cart Page
        <div className="cart-container">
          <div className="cart-content">
            <h2>🛒 Your Shopping Cart</h2>
            {cart.items.length === 0 ? (
              <div className="empty-cart">
                <p>Your cart is empty</p>
                <button onClick={() => setShowCart(false)} className="btn-continue">
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.items.map((item) => (
                    <div key={item.id} className="cart-item">
                      <img src={item.product.image} alt={item.product.name} />
                      <div className="cart-item-details">
                        <h3>{item.product.name}</h3>
                        <p className="cart-item-price">₹{item.product.price}</p>
                      </div>
                      <div className="cart-item-quantity">
                        <button 
                          onClick={() => handleUpdateCartItem(item.id, item.quantity - 1)}
                          className="qty-btn"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button 
                          onClick={() => handleUpdateCartItem(item.id, item.quantity + 1)}
                          className="qty-btn"
                        >
                          +
                        </button>
                      </div>
                      <div className="cart-item-subtotal">
                        ₹{item.subtotal}
                      </div>
                      <button 
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="btn-remove"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
                <div className="cart-summary">
                  <h3>Cart Summary</h3>
                  <div className="summary-row">
                    <span>Total Items:</span>
                    <span>{cart.total_items}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total Price:</span>
                    <span>₹{cart.total_price}</span>
                  </div>
                  <button onClick={handleProceedToCheckout} className="btn-checkout">
                    Proceed to Checkout
                  </button>
                  <button 
                    onClick={() => setShowCart(false)} 
                    className="btn-continue-secondary"
                  >
                    Continue Shopping
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : showAdminPanel && isAdmin ? (
        // Admin Panel
        <div className="admin-container">
          <div className="admin-panel">
            <h2>➕ Add New Product</h2>
            <form onSubmit={handleAddProduct} className="admin-form">
              <div className="input-group">
                <label>Product Name</label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  value={productForm.name}
                  onChange={(e) =>
                    setProductForm({ ...productForm, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea
                  placeholder="Enter product description"
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({ ...productForm, description: e.target.value })
                  }
                  required
                  rows="4"
                />
              </div>
              <div className="input-group">
                <label>Price (₹)</label>
                <input
                  type="number"
                  placeholder="Enter price"
                  value={productForm.price}
                  onChange={(e) =>
                    setProductForm({ ...productForm, price: e.target.value })
                  }
                  required
                  step="0.01"
                  min="0"
                />
              </div>
              <div className="input-group">
                <label>Stock Quantity</label>
                <input
                  type="number"
                  placeholder="Enter stock quantity"
                  value={productForm.stock}
                  onChange={(e) =>
                    setProductForm({ ...productForm, stock: e.target.value })
                  }
                  required
                  min="0"
                />
              </div>
              <div className="input-group">
                <label>Category</label>
                <select
                  value={productForm.category || 'other'}
                  onChange={(e) =>
                    setProductForm({ ...productForm, category: e.target.value })
                  }
                  required
                >
                  <option value="electronics">Electronics</option>
                  <option value="fashion">Fashion</option>
                  <option value="home">Home & Kitchen</option>
                  <option value="sports">Sports & Fitness</option>
                  <option value="books">Books</option>
                  <option value="toys">Toys & Games</option>
                  <option value="beauty">Beauty & Personal Care</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="input-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={productForm.available}
                    onChange={(e) =>
                      setProductForm({ ...productForm, available: e.target.checked })
                    }
                  />
                  <span>Product Available for Sale</span>
                </label>
              </div>
              <div className="input-group">
                <label>Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input"
                />
              </div>
              <button type="submit" className="btn-submit">
                Add Product
              </button>
            </form>
          </div>
        </div>
      ) : (
        // Product Grid with Search & Filters - CLEANER HOMEPAGE
        <>
          {/* Search & Filter Bar */}
          {!isAdmin && (
            <div className="search-filter-container">
              <div className="search-filter-content">
                {/* Search Bar */}
                <form onSubmit={handleSearch} className="search-form">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                  <button type="submit" className="btn-search">
                    🔍 Search
                  </button>
                </form>

                {/* Category Filter */}
                <div className="category-filter">
                  <label>Category:</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="category-select"
                  >
                    <option value="all">All Categories</option>
                    <option value="electronics">Electronics</option>
                    <option value="fashion">Fashion</option>
                    <option value="home">Home & Kitchen</option>
                    <option value="sports">Sports & Fitness</option>
                    <option value="books">Books</option>
                    <option value="toys">Toys & Games</option>
                    <option value="beauty">Beauty & Personal Care</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Sort Filter */}
                <div className="sort-filter">
                  <label>Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="sort-select"
                  >
                    <option value="">Latest</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="name_asc">Name: A to Z</option>
                    <option value="name_desc">Name: Z to A</option>
                  </select>
                </div>

                {/* Clear Filters Button */}
                {(searchQuery || selectedCategory !== "all" || sortBy) && (
                  <button onClick={handleClearFilters} className="btn-clear-filters">
                    ✖ Clear Filters
                  </button>
                )}
              </div>

              {/* Active Filters Display */}
              <div className="active-filters">
                {searchQuery && (
                  <span className="filter-tag">
                    Search: "{searchQuery}" 
                    <button onClick={() => { setSearchQuery(""); fetchProducts("", selectedCategory, sortBy); }}>×</button>
                  </span>
                )}
                {selectedCategory !== "all" && (
                  <span className="filter-tag">
                    Category: {selectedCategory}
                    <button onClick={() => handleCategoryChange("all")}>×</button>
                  </span>
                )}
                {sortBy && (
                  <span className="filter-tag">
                    Sort: {sortBy.replace('_', ' ')}
                    <button onClick={() => handleSortChange("")}>×</button>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Product Grid - CLEANER DESIGN */}
          <div className="product-grid">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product.id} className="product-card">
                  {/* Category Badge */}
                  <span className="product-category-badge">{product.category}</span>
                  <img
                    src={product.image || "/placeholder.png"}
                    alt={product.name}
                  />
                  <h3 className="product-title">{product.name}</h3>
                  <p className="price">₹{product.price}</p>
                  
                  {/* ✅ REMOVED: Product description from homepage */}
                  
                  <p className="stock-info">
                    {product.available && product.stock > 0 ? (
                      <span className="in-stock">📦 {product.stock} in stock</span>
                    ) : (
                      <span className="out-of-stock">❌ Out of stock</span>
                    )}
                  </p>
                  <div className="product-actions">
                    {!isAdmin ? (
                      <>
                        <button 
                          type="button"
                          className="btn-buy"
                          disabled={!product.available || product.stock === 0}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddToCart(product.id);
                          }}
                          style={{
                            cursor: product.available && product.stock > 0 ? 'pointer' : 'not-allowed',
                            opacity: product.available && product.stock > 0 ? 1 : 0.6
                          }}
                        >
                          {product.available && product.stock > 0 ? "🛒 Add to Cart" : "Out of Stock"}
                        </button>
                        <button 
                          type="button"
                          className="btn-view-details"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            fetchProductDetail(product.id);
                          }}
                        >
                          👁️ View Details
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          type="button"
                          className="btn-view-details" 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            fetchProductDetail(product.id);
                          }}
                        >
                          👁️ View Details
                        </button>
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteProduct(product.id);
                          }}
                          className="btn-delete"
                        >
                          🗑️
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-products">
                <p>No products found</p>
                {(searchQuery || selectedCategory !== "all") && (
                  <button onClick={handleClearFilters} className="btn-continue">
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* Footer */}
      {user && (
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Elysian Market</h3>
              <p>Your destination for quality products and exceptional service.</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><button onClick={() => {
                  setShowAbout(false);
                  setShowContact(false);
                  setShowCart(false);
                  setShowCheckout(false);
                  setShowOrders(false);
                  setShowAdminPanel(false);
                  setShowAdminOrders(false);
                  setShowProductDetail(false); // ✅ NEW
                }}>Shop</button></li>
                <li><button onClick={() => {
                  setShowAbout(true);
                  setShowContact(false);
                  setShowCart(false);
                  setShowCheckout(false);
                  setShowOrders(false);
                  setShowAdminPanel(false);
                  setShowAdminOrders(false);
                  setShowProductDetail(false); // ✅ NEW
                }}>About Us</button></li>
                <li><button onClick={() => {
                  setShowContact(true);
                  setShowAbout(false);
                  setShowCart(false);
                  setShowCheckout(false);
                  setShowOrders(false);
                  setShowAdminPanel(false);
                  setShowAdminOrders(false);
                  setShowProductDetail(false); // ✅ NEW
                }}>Contact</button></li>
                {!isAdmin && (
                  <li><button onClick={() => {
                    setShowOrders(true);
                    setShowAbout(false);
                    setShowContact(false);
                    setShowCart(false);
                    setShowCheckout(false);
                    setShowAdminPanel(false);
                    setShowAdminOrders(false);
                    setShowProductDetail(false); // ✅ NEW
                  }}>My Orders</button></li>
                )}
              </ul>
            </div>
            <div className="footer-section">
              <h4>Customer Service</h4>
              <ul>
                <li>FAQ</li>
                <li>Shipping & Returns</li>
                <li>Privacy Policy</li>
                <li>Terms & Conditions</li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Follow Us</h4>
              <div className="social-links">
                <span>📘</span>
                <span>📷</span>
                <span>🐦</span>
                <span>💼</span>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Elysian Market. All rights reserved.</p>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;