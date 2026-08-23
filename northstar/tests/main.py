"""
Northstar Retail Co. - Inventory Sync Service (Day 3 / Original Spec)

Polls a warehouse API every N minutes, caches stock levels, and exposes a
query endpoint for the support tool. See ../northstar-inventory-mvp.md for
the scoped requirements this implements.

Design note: the cache sits behind a small `StockStore` interface, and
writes to it come only through `sync_from_warehouse()`. That separation is
deliberate - when the polling method is retired (Day 4), only the
write path needs to change; the store and the read path (query endpoint)
stay exactly as they are.
"""

import logging
import random
import threading
import time
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Dict, Optional

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger("inventory-sync")

app = FastAPI(title="Northstar Inventory Sync Service")

POLL_INTERVAL_SECONDS = 300  # 5 minutes, per spec. Overridden in demo_test.py for fast testing.


# ---------------------------------------------------------------------------
# Cache layer - the only thing the query endpoint ever talks to.
# ---------------------------------------------------------------------------
@dataclass
class StockRecord:
    sku: str
    quantity: int
    last_synced_at: datetime


class StockStore:
    """In-memory cache of stock levels. Swap this for Redis/SQLite later
    without touching anything else."""

    def __init__(self):
        self._data: Dict[str, StockRecord] = {}
        self._lock = threading.Lock()

    def get(self, sku: str) -> Optional[StockRecord]:
        with self._lock:
            return self._data.get(sku)

    def update(self, sku: str, quantity: int, timestamp: datetime):
        with self._lock:
            self._data[sku] = StockRecord(sku=sku, quantity=quantity, last_synced_at=timestamp)

    def all_skus(self):
        with self._lock:
            return list(self._data.keys())


store = StockStore()


# ---------------------------------------------------------------------------
# Warehouse client - the thing that changes on Day 4.
# ---------------------------------------------------------------------------
class WarehouseAPIError(Exception):
    pass


class WarehouseClient:
    """
    Stand-in for Northstar's real warehouse API. In production this would
    make an HTTP call (e.g. `requests.get(WAREHOUSE_URL + "/stock")`).
    Here it simulates realistic conditions: normal responses most of the
    time, occasional outright failures, so we can prove graceful
    degradation actually works.
    """

    KNOWN_SKUS = ["SKU-100", "SKU-200", "SKU-300"]

    def fetch_all_stock(self) -> Dict[str, int]:
        # Simulate an occasional warehouse-side failure (timeout, 500, etc.)
        if random.random() < 0.2:
            raise WarehouseAPIError("Warehouse API did not respond")
        return {sku: random.randint(0, 50) for sku in self.KNOWN_SKUS}


warehouse_client = WarehouseClient()


# ---------------------------------------------------------------------------
# Poller - runs on a schedule, writes to the store, never touches the
# query path directly.
# ---------------------------------------------------------------------------
def sync_from_warehouse():
    try:
        stock_levels = warehouse_client.fetch_all_stock()
    except WarehouseAPIError as e:
        # Graceful degradation: log it, keep serving whatever's already
        # cached. Do NOT clear or corrupt the store.
        log.warning(f"Warehouse poll failed, serving last known values: {e}")
        return

    now = datetime.now(timezone.utc)
    for sku, qty in stock_levels.items():
        store.update(sku, qty, now)
    log.info(f"Synced {len(stock_levels)} SKUs from warehouse at {now.isoformat()}")


def poller_loop(interval_seconds: int, stop_event: threading.Event):
    while not stop_event.is_set():
        sync_from_warehouse()
        stop_event.wait(interval_seconds)


_stop_event = threading.Event()


@app.on_event("startup")
def start_poller():
    sync_from_warehouse()  # populate immediately on boot, then keep polling
    t = threading.Thread(
        target=poller_loop, args=(POLL_INTERVAL_SECONDS, _stop_event), daemon=True
    )
    t.start()


@app.on_event("shutdown")
def stop_poller():
    _stop_event.set()


# ---------------------------------------------------------------------------
# Query endpoint - the only thing the support tool calls.
# ---------------------------------------------------------------------------
class StockResponse(BaseModel):
    sku: str
    quantity: int
    last_synced_at: datetime
    stale: bool


@app.get("/stock/{sku}", response_model=StockResponse)
def get_stock(sku: str):
    record = store.get(sku)
    if record is None:
        raise HTTPException(status_code=404, detail=f"Unknown SKU: {sku}")

    age_seconds = (datetime.now(timezone.utc) - record.last_synced_at).total_seconds()
    stale = age_seconds > POLL_INTERVAL_SECONDS * 2  # more than 2 missed cycles

    return StockResponse(
        sku=record.sku,
        quantity=record.quantity,
        last_synced_at=record.last_synced_at,
        stale=stale,
    )


@app.get("/debug/all")
def debug_all():
    """Not for production - handy for the demo/test script."""
    return {sku: store.get(sku) for sku in store.all_skus()}
