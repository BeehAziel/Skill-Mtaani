# Northstar Inventory Sync Service — Day 3 (Original Spec)

Implements the MVP: poll a warehouse API every 5 minutes, cache stock,
expose a query endpoint. See `northstar-inventory-mvp.md` for the scoped
requirements this satisfies.

## Files
- `main.py` — the service: `StockStore` (cache), `WarehouseClient`
  (simulated vendor, 20% random failure rate to prove graceful
  degradation), poller, and the `GET /stock/{sku}` query endpoint.
- `run_server.py` — starts the service standalone with a 2-second poll
  interval for quick manual testing (`python run_server.py`, then hit
  `http://127.0.0.1:8001/stock/SKU-100`).
- `run_and_test.py` — starts the server in-process and runs through all
  4 MVP acceptance criteria automatically. Run with:
  ```bash
  pip install fastapi uvicorn httpx
  python run_and_test.py
  ```l
## Design note (for Day 4)
All writes to the cache go through `sync_from_warehouse()`, which is the
*only* thing that touches `WarehouseClient`. The query endpoint only ever
reads from `StockStore`. When polling is killed in favor of a webhook
push model, only `sync_from_warehouse()` and its trigger (a poller loop)
need to be replaced with a webhook handler that calls `store.update()`
directly — `StockStore` and `GET /stock/{sku}` shouldn't need to change
at all. Worth noting explicitly in the Scope Delta Analysis as evidence
the MVP was built with the pivot in mind.
