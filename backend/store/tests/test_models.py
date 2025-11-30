# store/tests/test_models.py
from django.test import TestCase
from django.utils import timezone
from store.models import Product

class ProductModelTest(TestCase):
    def test_str_returns_name(self):
        """__str__ should return the product name."""
        p = Product.objects.create(
            name="Test Product",
            description="Test description",
            price="199.99",
            stock=5
        )
        self.assertEqual(str(p), "Test Product")

    def test_defaults_and_created_at(self):
        """Default 'available' should be True and created_at should be set."""
        p = Product.objects.create(
            name="Default Check",
            description="Checking defaults",
            price="50.00",
            stock=1
        )
        # default available True
        self.assertTrue(p.available)
        # created_at should be recent (not None and <= now)
        self.assertIsNotNone(p.created_at)
        self.assertLessEqual(p.created_at, timezone.now())
