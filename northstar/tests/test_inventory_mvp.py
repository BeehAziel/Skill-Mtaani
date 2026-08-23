import unittest
from datetime import datetime, timezone

from fastapi.testclient import TestClient

import main


class InventorySyncServiceMVPTests(unittest.TestCase):
    def setUp(self):
        main.store._data.clear()

    def test_sync_updates_cache_for_known_sku(self):
        original = main.warehouse_client.fetch_all_stock
        main.warehouse_client.fetch_all_stock = lambda: {"SKU-100": 15}
        try:
            main.sync_from_warehouse()
        finally:
            main.warehouse_client.fetch_all_stock = original

        record = main.store.get("SKU-100")
        self.assertIsNotNone(record)
        self.assertEqual(record.quantity, 15)

    def test_get_stock_returns_cached_quantity_for_known_sku(self):
        main.store.update("SKU-200", 9, datetime.now(timezone.utc))
        client = TestClient(main.app)

        response = client.get("/stock/SKU-200")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["sku"], "SKU-200")
        self.assertEqual(response.json()["quantity"], 9)

    def test_get_stock_returns_404_for_unknown_sku(self):
        client = TestClient(main.app)

        response = client.get("/stock/SKU-DOES-NOT-EXIST")

        self.assertEqual(response.status_code, 404)

    def test_sync_failure_keeps_last_good_value(self):
        main.store.update("SKU-300", 21, datetime.now(timezone.utc))
        original = main.warehouse_client.fetch_all_stock
        main.warehouse_client.fetch_all_stock = lambda: (_ for _ in ()).throw(main.WarehouseAPIError("Warehouse API did not respond"))
        try:
            main.sync_from_warehouse()
        finally:
            main.warehouse_client.fetch_all_stock = original

        response = TestClient(main.app).get("/stock/SKU-300")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["quantity"], 21)


if __name__ == "__main__":
    unittest.main()
