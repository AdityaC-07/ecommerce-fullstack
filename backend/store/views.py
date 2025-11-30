from django.shortcuts import render, redirect, get_object_or_404
from django.views import View
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required, user_passes_test
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.conf import settings

from .models import Product
from .forms import ProductForm
from rest_framework import viewsets
from .serializers import ProductSerializer
from .models import Cart, CartItem, Order, OrderItem, Review
from .serializers import CartSerializer, CartItemSerializer, OrderSerializer
import json
import uuid
from django.db import models

# 🏠 Home page
def home(request):
    return render(request, 'store/home.html', {'message': 'Welcome to the Store!'})

@method_decorator(csrf_exempt, name='dispatch')
class ProductListView(View):
    def get(self, request):
        # Get query parameters
        search = request.GET.get('search', '')
        category = request.GET.get('category', '')
        sort_by = request.GET.get('sort', '')
        
        # Start with all products
        products = Product.objects.all()
        
        # Apply search filter
        if search:
            products = products.filter(
                models.Q(name__icontains=search) | 
                models.Q(description__icontains=search)
            )
        
        # Apply category filter
        if category and category != 'all':
            products = products.filter(category=category)
        
        # Apply sorting
        if sort_by == 'price_low':
            products = products.order_by('price')
        elif sort_by == 'price_high':
            products = products.order_by('-price')
        elif sort_by == 'name_asc':
            products = products.order_by('name')
        elif sort_by == 'name_desc':
            products = products.order_by('-name')
        else:
            products = products.order_by('-created_at')  # Default: newest first
        
        product_list = []
        for p in products:
            image_url = (
                request.build_absolute_uri(p.image.url)
                if p.image
                else request.build_absolute_uri(f"{settings.MEDIA_URL}default.png")
            )
            product_list.append({
                "id": p.id,
                "name": p.name,
                "price": str(p.price),
                "description": p.description,
                "image": image_url,
                "stock": p.stock,
                "available": p.available,
                "category": p.category  # ✅ NEW
            })

        return JsonResponse(product_list, safe=False)

# 🛒 Product List (Template-based) — visible to everyone
def product_list_template(request):
    products = Product.objects.all()
    return render(request, 'store/product_list.html', {'products': products})

# 🧩 Add Product (Admin Only - Template based)
@login_required(login_url='login')
@user_passes_test(lambda u: u.is_staff)
def add_product(request):
    if request.method == 'POST':
        form = ProductForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            messages.success(request, "✅ Product added successfully!")
            return redirect('product-list')
        else:
            messages.error(request, "Please correct the errors below.")
    else:
        form = ProductForm()
    return render(request, 'store/add_product.html', {'form': form})

# ⚛️ React Demo Page (Optional)
def react_widget(request):
    return render(request, 'store/react_widget.html')

# 👤 Signup (Customer Registration)
def signup_view(request):
    if request.method == "POST":
        username = request.POST.get("username")
        email = request.POST.get("email")
        password = request.POST.get("password")
        confirm = request.POST.get("confirm")

        if password != confirm:
            messages.error(request, "❌ Passwords do not match!")
            return redirect("signup")

        if User.objects.filter(username=username).exists():
            messages.error(request, "⚠️ Username already exists!")
            return redirect("signup")

        user = User.objects.create_user(username=username, email=email, password=password)
        user.save()
        messages.success(request, "✅ Account created successfully! Please log in.")
        return redirect("login")

    return render(request, "store/signup.html")

# 🔑 Login (Template based)
def login_view(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            if user.is_staff:
                messages.success(request, f"Welcome, Admin {username} 👑!")
                return redirect("add-product")
            else:
                messages.success(request, f"Welcome, {username}! 👋")
                return redirect("product-list")
        else:
            messages.error(request, "❌ Invalid username or password.")
            return redirect("login")

    return render(request, "store/login.html")

# 🚪 Logout (Template based)
def logout_view(request):
    logout(request)
    messages.info(request, "👋 You have been logged out.")
    return redirect("login")

# 🧩 REST Framework Viewset (Optional — if using DRF routers)
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


# ==========================================
# 🔐 API ENDPOINTS FOR REACT FRONTEND
# ==========================================

# --- API Login ---
@csrf_exempt
def api_login(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username")
            password = data.get("password")
            
            print(f"🔐 Login attempt - Username: {username}")

            user = authenticate(request, username=username, password=password)
            
            if user is not None:
                login(request, user)
                print(f"✅ Login successful - User: {user.username}, Staff: {user.is_staff}")
                return JsonResponse({
                    "message": "Login successful",
                    "username": user.username,
                    "is_staff": user.is_staff,
                    "is_authenticated": True
                })
            else:
                print(f"❌ Login failed - Invalid credentials for: {username}")
                return JsonResponse({"error": "Invalid username or password"}, status=400)
        except Exception as e:
            print(f"❌ Login error: {str(e)}")
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "POST request required"}, status=405)


# --- API Logout ---
@csrf_exempt
def api_logout(request):
    logout(request)
    return JsonResponse({"message": "Logged out"})


# --- API Check Auth Status ---
@csrf_exempt
def api_check_auth(request):
    print(f"🔍 Check Auth - User: {request.user}")
    print(f"🔍 Is Authenticated: {request.user.is_authenticated}")
    
    if request.user.is_authenticated:
        return JsonResponse({
            "username": request.user.username,
            "is_staff": request.user.is_staff,
            "is_authenticated": True
        })
    return JsonResponse({
        "is_authenticated": False,
        "username": None,
        "is_staff": False
    })


# --- ✅ FIXED: API to Add Product (Admin Only) ---
@csrf_exempt
def api_add_product(request):
    if request.method == "POST":
        if not request.user.is_authenticated or not request.user.is_staff:
            return JsonResponse({"error": "Admin access required"}, status=403)
        
        try:
            name = request.POST.get('name')
            description = request.POST.get('description')
            price = request.POST.get('price')
            stock = request.POST.get('stock')
            category = request.POST.get('category', 'other')  # ✅ NEW
            available = request.POST.get('available', 'true').lower() == 'true'
            image = request.FILES.get('image')
            
            if not all([name, description, price, stock]):
                return JsonResponse({"error": "All fields are required"}, status=400)
            
            try:
                stock = int(stock)
                if stock < 0:
                    return JsonResponse({"error": "Stock cannot be negative"}, status=400)
            except ValueError:
                return JsonResponse({"error": "Stock must be a valid number"}, status=400)
            
            product = Product.objects.create(
                name=name,
                description=description,
                price=price,
                stock=stock,
                available=available,
                category=category,  # ✅ NEW
                image=image
            )
            
            return JsonResponse({
                "message": "Product added successfully",
                "product": {
                    "id": product.id,
                    "name": product.name,
                    "description": product.description,
                    "price": str(product.price),
                    "stock": product.stock,
                    "available": product.available,
                    "category": product.category,  # ✅ NEW
                    "image": request.build_absolute_uri(product.image.url) if product.image else None
                }
            })
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    
    return JsonResponse({"error": "POST request required"}, status=405)

# --- API to Delete Product (Admin Only) ---
@csrf_exempt
def api_delete_product(request, product_id):
    if request.method == "DELETE":
        # Check if user is admin
        if not request.user.is_authenticated or not request.user.is_staff:
            return JsonResponse({"error": "Admin access required"}, status=403)
        
        try:
            product = Product.objects.get(id=product_id)
            product_name = product.name
            product.delete()
            return JsonResponse({
                "message": f"Product '{product_name}' deleted successfully"
            })
        except Product.DoesNotExist:
            return JsonResponse({"error": "Product not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    
    return JsonResponse({"error": "DELETE request required"}, status=405)


# --- API to Update Product (Admin Only) ---
@csrf_exempt
def api_update_product(request, product_id):
    if request.method == "PUT":
        # Check if user is admin
        if not request.user.is_authenticated or not request.user.is_staff:
            return JsonResponse({"error": "Admin access required"}, status=403)
        
        try:
            product = Product.objects.get(id=product_id)
            data = json.loads(request.body)
            
            # Update fields if provided
            if 'name' in data:
                product.name = data['name']
            if 'description' in data:
                product.description = data['description']
            if 'price' in data:
                product.price = data['price']
            if 'stock' in data:
                product.stock = data['stock']
            if 'available' in data:  # ✅ Update available field
                product.available = data['available']
            
            product.save()
            
            return JsonResponse({
                "message": "Product updated successfully",
                "product": {
                    "id": product.id,
                    "name": product.name,
                    "description": product.description,
                    "price": str(product.price),
                    "stock": product.stock,
                    "available": product.available,
                    "image": request.build_absolute_uri(product.image.url) if product.image else None
                }
            })
        except Product.DoesNotExist:
            return JsonResponse({"error": "Product not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    
    return JsonResponse({"error": "PUT request required"}, status=405)
#  Experiment 7: React JSX Demo
def react_jsx_demo(request):
    """
    Demonstrates integration of React JSX with Django using verbatim tag
    """
    return render(request, 'store/react_jsx_demo.html')

# ==========================================
# 🛒 SHOPPING CART API ENDPOINTS
# ==========================================

@csrf_exempt
def api_get_cart(request):
    """Get current user's cart"""
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Authentication required"}, status=401)
    
    try:
        # Get or create cart for user
        cart, created = Cart.objects.get_or_create(user=request.user)
        
        # Serialize cart with items
        cart_items = []
        for item in cart.items.all():
            cart_items.append({
                'id': item.id,
                'product': {
                    'id': item.product.id,
                    'name': item.product.name,
                    'price': str(item.product.price),
                    'image': request.build_absolute_uri(item.product.image.url) if item.product.image else None,
                    'stock': item.product.stock,
                    'available': item.product.available
                },
                'quantity': item.quantity,
                'subtotal': str(item.subtotal)
            })
        
        return JsonResponse({
            'id': cart.id,
            'items': cart_items,
            'total_items': cart.total_items,
            'total_price': str(cart.total_price)
        })
    
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
def api_add_to_cart(request):
    """Add product to cart"""
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Authentication required"}, status=401)
    
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=405)
    
    try:
        data = json.loads(request.body)
        product_id = data.get('product_id')
        quantity = int(data.get('quantity', 1))
        
        if not product_id:
            return JsonResponse({"error": "Product ID is required"}, status=400)
        
        if quantity < 1:
            return JsonResponse({"error": "Quantity must be at least 1"}, status=400)
        
        # Get product
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return JsonResponse({"error": "Product not found"}, status=404)
        
        # Check stock
        if not product.available or product.stock < quantity:
            return JsonResponse({"error": "Product not available or insufficient stock"}, status=400)
        
        # Get or create cart
        cart, created = Cart.objects.get_or_create(user=request.user)
        
        # Get or create cart item
        cart_item, item_created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': quantity}
        )
        
        if not item_created:
            # Update quantity if item already exists
            new_quantity = cart_item.quantity + quantity
            if new_quantity > product.stock:
                return JsonResponse({"error": f"Cannot add more. Only {product.stock} in stock"}, status=400)
            cart_item.quantity = new_quantity
            cart_item.save()
        
        return JsonResponse({
            "message": f"Added {product.name} to cart",
            "cart_item_id": cart_item.id,
            "quantity": cart_item.quantity,
            "total_items": cart.total_items
        })
    
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
def api_update_cart_item(request, item_id):
    """Update cart item quantity"""
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Authentication required"}, status=401)
    
    if request.method != "PUT":
        return JsonResponse({"error": "PUT request required"}, status=405)
    
    try:
        data = json.loads(request.body)
        quantity = int(data.get('quantity', 1))
        
        if quantity < 1:
            return JsonResponse({"error": "Quantity must be at least 1"}, status=400)
        
        # Get cart item
        try:
            cart_item = CartItem.objects.get(id=item_id, cart__user=request.user)
        except CartItem.DoesNotExist:
            return JsonResponse({"error": "Cart item not found"}, status=404)
        
        # Check stock
        if quantity > cart_item.product.stock:
            return JsonResponse({"error": f"Only {cart_item.product.stock} in stock"}, status=400)
        
        cart_item.quantity = quantity
        cart_item.save()
        
        return JsonResponse({
            "message": "Cart updated",
            "quantity": cart_item.quantity,
            "subtotal": str(cart_item.subtotal),
            "total_items": cart_item.cart.total_items,
            "total_price": str(cart_item.cart.total_price)
        })
    
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
def api_remove_from_cart(request, item_id):
    """Remove item from cart"""
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Authentication required"}, status=401)
    
    if request.method != "DELETE":
        return JsonResponse({"error": "DELETE request required"}, status=405)
    
    try:
        # Get cart item
        try:
            cart_item = CartItem.objects.get(id=item_id, cart__user=request.user)
        except CartItem.DoesNotExist:
            return JsonResponse({"error": "Cart item not found"}, status=404)
        
        product_name = cart_item.product.name
        cart = cart_item.cart
        cart_item.delete()
        
        return JsonResponse({
            "message": f"Removed {product_name} from cart",
            "total_items": cart.total_items,
            "total_price": str(cart.total_price)
        })
    
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
def api_clear_cart(request):
    """Clear all items from cart"""
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Authentication required"}, status=401)
    
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=405)
    
    try:
        cart = Cart.objects.filter(user=request.user).first()
        if cart:
            cart.items.all().delete()
        
        return JsonResponse({"message": "Cart cleared"})
    
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

# ==========================================
# 📦 ORDER API ENDPOINTS
# ==========================================

@csrf_exempt
def api_create_order(request):
    """Create order from cart"""
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Authentication required"}, status=401)
    
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=405)
    
    try:
        data = json.loads(request.body)
        
        # Get user's cart
        try:
            cart = Cart.objects.get(user=request.user)
        except Cart.DoesNotExist:
            return JsonResponse({"error": "Cart is empty"}, status=400)
        
        if cart.items.count() == 0:
            return JsonResponse({"error": "Cart is empty"}, status=400)
        
        # Validate shipping information
        required_fields = ['full_name', 'email', 'phone', 'address', 'city', 'state', 'pincode']
        for field in required_fields:
            if not data.get(field):
                return JsonResponse({"error": f"{field} is required"}, status=400)
        
        # Check stock availability
        for item in cart.items.all():
            if item.product.stock < item.quantity:
                return JsonResponse({
                    "error": f"Insufficient stock for {item.product.name}. Only {item.product.stock} available."
                }, status=400)
        
        # Create order
        order = Order.objects.create(
            user=request.user,
            full_name=data['full_name'],
            email=data['email'],
            phone=data['phone'],
            address=data['address'],
            city=data['city'],
            state=data['state'],
            pincode=data['pincode'],
            total_amount=cart.total_price,
            payment_method=data.get('payment_method', 'Cash on Delivery')
        )
        
        # Create order items and update stock
        for cart_item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                quantity=cart_item.quantity,
                price=cart_item.product.price
            )
            
            # Reduce stock
            cart_item.product.stock -= cart_item.quantity
            cart_item.product.save()
        
        # Clear cart
        cart.items.all().delete()
        
        return JsonResponse({
            "message": "Order placed successfully",
            "order_number": order.order_number,
            "order_id": order.id,
            "total_amount": str(order.total_amount)
        })
    
    except Exception as e:
        print(f"Error creating order: {str(e)}")
        return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
def api_get_orders(request):
    """Get user's order history"""
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Authentication required"}, status=401)
    
    try:
        orders = Order.objects.filter(user=request.user)
        orders_list = []
        
        for order in orders:
            order_items = []
            for item in order.items.all():
                order_items.append({
                    'id': item.id,
                    'product_name': item.product.name,
                    'product_image': request.build_absolute_uri(item.product.image.url) if item.product.image else None,
                    'quantity': item.quantity,
                    'price': str(item.price),
                    'subtotal': str(item.subtotal)
                })
            
            orders_list.append({
                'id': order.id,
                'order_number': order.order_number,
                'full_name': order.full_name,
                'address': order.address,
                'city': order.city,
                'state': order.state,
                'pincode': order.pincode,
                'total_amount': str(order.total_amount),
                'status': order.status,
                'payment_method': order.payment_method,
                'payment_status': order.payment_status,
                'items': order_items,
                'created_at': order.created_at.isoformat(),
            })
        
        return JsonResponse({'orders': orders_list})
    
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
def api_get_order_detail(request, order_id):
    """Get single order details"""
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Authentication required"}, status=401)
    
    try:
        order = Order.objects.get(id=order_id, user=request.user)
        
        order_items = []
        for item in order.items.all():
            order_items.append({
                'id': item.id,
                'product_name': item.product.name,
                'product_image': request.build_absolute_uri(item.product.image.url) if item.product.image else None,
                'quantity': item.quantity,
                'price': str(item.price),
                'subtotal': str(item.subtotal)
            })
        
        order_data = {
            'id': order.id,
            'order_number': order.order_number,
            'full_name': order.full_name,
            'email': order.email,
            'phone': order.phone,
            'address': order.address,
            'city': order.city,
            'state': order.state,
            'pincode': order.pincode,
            'total_amount': str(order.total_amount),
            'status': order.status,
            'payment_method': order.payment_method,
            'payment_status': order.payment_status,
            'items': order_items,
            'created_at': order.created_at.isoformat(),
        }
        
        return JsonResponse(order_data)
    
    except Order.DoesNotExist:
        return JsonResponse({"error": "Order not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


# ==========================================
# 👑 ADMIN ORDER MANAGEMENT
# ==========================================

@csrf_exempt
def api_admin_get_all_orders(request):
    """Admin: Get all orders"""
    if not request.user.is_authenticated or not request.user.is_staff:
        return JsonResponse({"error": "Admin access required"}, status=403)
    
    try:
        orders = Order.objects.all()
        orders_list = []
        
        for order in orders:
            orders_list.append({
                'id': order.id,
                'order_number': order.order_number,
                'username': order.user.username,
                'full_name': order.full_name,
                'email': order.email,
                'phone': order.phone,
                'total_amount': str(order.total_amount),
                'status': order.status,
                'payment_method': order.payment_method,
                'created_at': order.created_at.isoformat(),
                'item_count': order.items.count()
            })
        
        return JsonResponse({'orders': orders_list})
    
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
def api_admin_update_order_status(request, order_id):
    """Admin: Update order status"""
    if not request.user.is_authenticated or not request.user.is_staff:
        return JsonResponse({"error": "Admin access required"}, status=403)
    
    if request.method != "PUT":
        return JsonResponse({"error": "PUT request required"}, status=405)
    
    try:
        data = json.loads(request.body)
        new_status = data.get('status')
        
        if not new_status:
            return JsonResponse({"error": "Status is required"}, status=400)
        
        valid_statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
        if new_status not in valid_statuses:
            return JsonResponse({"error": "Invalid status"}, status=400)
        
        order = Order.objects.get(id=order_id)
        order.status = new_status
        order.save()
        
        return JsonResponse({
            "message": f"Order status updated to {new_status}",
            "order_number": order.order_number,
            "status": order.status
        })
    
    except Order.DoesNotExist:
        return JsonResponse({"error": "Order not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
    
# ✅ API Sign Up (Add this with other API functions)
@csrf_exempt
def api_signup(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username")
            email = data.get("email")
            password = data.get("password")
            confirm_password = data.get("confirm_password")
            
            # Validation
            if not all([username, email, password, confirm_password]):
                return JsonResponse({"error": "All fields are required"}, status=400)
            
            if password != confirm_password:
                return JsonResponse({"error": "Passwords do not match"}, status=400)
            
            if len(password) < 6:
                return JsonResponse({"error": "Password must be at least 6 characters"}, status=400)
            
            if User.objects.filter(username=username).exists():
                return JsonResponse({"error": "Username already exists"}, status=400)
            
            if User.objects.filter(email=email).exists():
                return JsonResponse({"error": "Email already exists"}, status=400)
            
            # Create user
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password
            )
            
            # Auto login after signup
            login(request, user)
            
            return JsonResponse({
                "message": "Account created successfully",
                "username": user.username,
                "is_staff": user.is_staff
            })
            
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    
    return JsonResponse({"error": "POST request required"}, status=405)


# ✅ API Contact Form (Add this)
@csrf_exempt
def api_contact(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            name = data.get("name")
            email = data.get("email")
            subject = data.get("subject")
            message = data.get("message")
            
            if not all([name, email, subject, message]):
                return JsonResponse({"error": "All fields are required"}, status=400)
            
            # Here you can save to database or send email
            # For now, we'll just log it
            print(f"Contact Form Submission:")
            print(f"Name: {name}")
            print(f"Email: {email}")
            print(f"Subject: {subject}")
            print(f"Message: {message}")
            
            return JsonResponse({
                "message": "Thank you! Your message has been sent. We'll get back to you soon."
            })
            
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    
    return JsonResponse({"error": "POST request required"}, status=405)

@csrf_exempt
def api_get_product_detail(request, product_id):
    """Get single product details with reviews"""
    try:
        product = Product.objects.get(id=product_id)
        
        # Get reviews
        reviews = []
        for review in product.reviews.all():
            reviews.append({
                'id': review.id,
                'username': review.user.username,
                'rating': review.rating,
                'review_text': review.review_text,
                'created_at': review.created_at.isoformat(),
            })
        
        product_data = {
            'id': product.id,
            'name': product.name,
            'description': product.description,
            'price': str(product.price),
            'stock': product.stock,
            'available': product.available,
            'category': product.category,
            'image': request.build_absolute_uri(product.image.url) if product.image else None,
            'average_rating': round(product.average_rating, 1),
            'review_count': product.review_count,
            'reviews': reviews
        }
        
        return JsonResponse(product_data)
        
    except Product.DoesNotExist:
        return JsonResponse({"error": "Product not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

@csrf_exempt
def api_add_review(request, product_id):
    """Add product review"""
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Authentication required"}, status=401)
    
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=405)
    
    try:
        data = json.loads(request.body)
        rating = data.get('rating')
        review_text = data.get('review_text')
        
        if not rating or not review_text:
            return JsonResponse({"error": "Rating and review text are required"}, status=400)
        
        rating = int(rating)
        if rating < 1 or rating > 5:
            return JsonResponse({"error": "Rating must be between 1 and 5"}, status=400)
        
        product = Product.objects.get(id=product_id)
        
        # Check if user already reviewed this product
        existing_review = Review.objects.filter(product=product, user=request.user).first()
        
        if existing_review:
            # Update existing review
            existing_review.rating = rating
            existing_review.review_text = review_text
            existing_review.save()
            message = "Review updated successfully"
        else:
            # Create new review
            Review.objects.create(
                product=product,
                user=request.user,
                rating=rating,
                review_text=review_text
            )
            message = "Review added successfully"
        
        return JsonResponse({
            "message": message,
            "average_rating": round(product.average_rating, 1),
            "review_count": product.review_count
        })
        
    except Product.DoesNotExist:
        return JsonResponse({"error": "Product not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

@csrf_exempt
def api_delete_review(request, review_id):
    """Delete review (user can delete own review, admin can delete any)"""
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Authentication required"}, status=401)
    
    if request.method != "DELETE":
        return JsonResponse({"error": "DELETE request required"}, status=405)
    
    try:
        review = Review.objects.get(id=review_id)
        
        # Check permissions
        if review.user != request.user and not request.user.is_staff:
            return JsonResponse({"error": "Permission denied"}, status=403)
        
        product = review.product
        review.delete()
        
        return JsonResponse({
            "message": "Review deleted successfully",
            "average_rating": round(product.average_rating, 1),
            "review_count": product.review_count
        })
        
    except Review.DoesNotExist:
        return JsonResponse({"error": "Review not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)