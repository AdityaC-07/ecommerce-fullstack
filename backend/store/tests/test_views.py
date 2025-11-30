# store/tests/test_views.py
from django.test import TestCase
from django.urls import reverse
from store.models import Product

class ProductListViewTests(TestCase):
    def setUp(self):
        # Create a product to be shown in the list
        Product.objects.create(
            name="Wireless Mouse",
            description="Ergonomic wireless mouse",
            price="799.00",
            stock=100
        )

    def test_list_view_status_code_and_template(self):
        url = reverse('product-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        # ensure template contains product name
        self.assertContains(response, "Wireless Mouse")

class AddProductViewTests(TestCase):
    def test_get_add_product_page(self):
        url = reverse('add-product')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, '<form')  # basic check that form is present

    def test_post_valid_data_creates_product_and_redirects(self):
        url = reverse('add-product')
        data = {
            'name': 'Bluetooth Headphones',
            'description': 'Over-ear, noise cancelling',
            'price': '2999.99',
            'stock': '50',
            'available': 'on',  # checkbox sends 'on' when checked
        }
        response = self.client.post(url, data)
        # Should create 1 product and redirect to product-list
        self.assertEqual(Product.objects.count(), 1)
        self.assertRedirects(response, reverse('product-list'))

    def test_post_invalid_data_shows_validation_errors(self):
        url = reverse('add-product')
        # price <= 0 triggers our form validation
        data = {
            'name': 'Invalid Product',
            'description': 'Bad price',
            'price': '0',
            'stock': '10',
            'available': 'on',
        }
        response = self.client.post(url, data)
        # Product should not be created
        self.assertEqual(Product.objects.count(), 0)
        # Form is re-rendered with error message from the form (text shown in template)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Price must be greater than 0")
