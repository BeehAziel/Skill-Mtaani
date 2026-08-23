"""
Runs the FastAPI server in a background thread within THIS process (avoids
shell job-control issues with backgrounding uvicorn as a separate OS
process), then executes the same checks as demo_test.py against it.
"""
import threading
import time

import httpx
import uvicorn

import main as app_module

app_module.POLL_INTERVAL_SECONDS = 2  # fast interval for the demo

config = uvicorn.Config(app_module.app, host="127.0.0.1", port=8001, log_level="warning")
server = uvicorn.Server(config)

server_thread = threading.Thread(target=server.run, daemon=True)
server_thread.start()

# Wait for the server to actually be ready
for _ in range(50):
    if server.started:
        break
    time.sleep(0.1)

BASE = "http://127.0.0.1:8001"


def get_stock(sku):
    return httpx.get(f"{BASE}/stock/{sku}")


try:
    print("=== Waiting for first poll cycle to populate the cache ===")
    time.sleep(1.5)

    print("\n=== 1. Known SKU returns cached data ===")
    r = get_stock("SKU-100")
    print("Status:", r.status_code, "-> ", r.json())
    assert r.status_code == 200
    first_synced = r.json()["last_synced_at"]

    print("\n=== 2. Unknown SKU returns clean 404 ===")
    r = get_stock("SKU-DOES-NOT-EXIST")
    print("Status:", r.status_code, "-> ", r.json())
    assert r.status_code == 404

    print("\n=== 3. Cache updates across poll cycles ===")
    time.sleep(4)
    r = get_stock("SKU-100")
    second_synced = r.json()["last_synced_at"]
    print(f"First sync: {first_synced} -> Later sync: {second_synced}")
    assert second_synced != first_synced, "Expected last_synced_at to advance across polls"

    print("\n=== 4. Query endpoint survives repeated warehouse failures ===")
    for i in range(6):
        r = get_stock("SKU-200")
        assert r.status_code == 200, f"Query endpoint failed on attempt {i}"
        print(f"  attempt {i}: qty={r.json()['quantity']} stale={r.json()['stale']}")
        time.sleep(2)

    print("\n✅ ALL CHECKS PASSED: polling MVP meets its acceptance criteria.")
finally:
    server.should_exit = True
    server_thread.join(timeout=5)
