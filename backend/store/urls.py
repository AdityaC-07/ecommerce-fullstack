from django.urls import path, include
from rest_framework import routers
from .views import (
    ProductViewSet, 
    ProductListView, 
    add_product, 
    home, 
    signup_view, 
    login_view, 
    logout_view, 
    api_login, 
    api_logout,
    api_check_auth,
    api_add_product,
    api_delete_product,
    api_update_product,
    react_jsx_demo,
    # ✅ Cart views
    api_get_cart,
    api_add_to_cart,
    api_update_cart_item,
    api_remove_from_cart,
    api_clear_cart,
    # ✅ Order views
    api_create_order,
    api_get_orders,
    api_get_order_detail,
    api_admin_get_all_orders,
    api_admin_update_order_status,
    api_signup,  
    api_contact, 
    api_get_product_detail, 
    api_add_review,
    api_delete_review 
)

router = routers.DefaultRouter()
router.register(r'products-drf', ProductViewSet)

urlpatterns = [
    # Template-based views
    path('', home, name='home'),
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/add/', add_product, name='add-product'),
    path('signup/', signup_view, name='signup'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('react-jsx-demo/', react_jsx_demo, name='react-jsx-demo'),
    
    # REST framework routes
    path('', include(router.urls)),
    
    # Authentication API
    path('api/login/', api_login, name='api-login'),
    path('api/logout/', api_logout, name='api-logout'),
    path('api/check-auth/', api_check_auth, name='api-check-auth'),
    path('api/signup/', api_signup, name='api-signup'),
    path('api/contact/', api_contact, name='api-contact'),
    
    # Product API
    path('api/products/', ProductListView.as_view(), name='api-products'),
    path('api/products/add/', api_add_product, name='api-add-product'),
    path('api/products/delete/<int:product_id>/', api_delete_product, name='api-delete-product'),
    path('api/products/update/<int:product_id>/', api_update_product, name='api-update-product'),
    
    #  Cart API
    path('api/cart/', api_get_cart, name='api-get-cart'),
    path('api/cart/add/', api_add_to_cart, name='api-add-to-cart'),
    path('api/cart/update/<int:item_id>/', api_update_cart_item, name='api-update-cart-item'),
    path('api/cart/remove/<int:item_id>/', api_remove_from_cart, name='api-remove-from-cart'),
    path('api/cart/clear/', api_clear_cart, name='api-clear-cart'),

     # ✅ Order API
    path('api/orders/create/', api_create_order, name='api-create-order'),
    path('api/orders/', api_get_orders, name='api-get-orders'),
    path('api/orders/<int:order_id>/', api_get_order_detail, name='api-get-order-detail'),
    
    # ✅ Admin Order Management
    path('api/admin/orders/', api_admin_get_all_orders, name='api-admin-get-all-orders'),
    path('api/admin/orders/<int:order_id>/status/', api_admin_update_order_status, name='api-admin-update-order-status'),

    # ✅ Product Details & Reviews
    path('api/products/<int:product_id>/detail/', api_get_product_detail, name='api-product-detail'),
    path('api/products/<int:product_id>/review/', api_add_review, name='api-add-review'),
    path('api/reviews/<int:review_id>/delete/', api_delete_review, name='api-delete-review'),


]