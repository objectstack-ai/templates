# @templates/inventory

A minimal inventory management application template built on [@objectstack/spec](https://github.com/objectstack-ai/hotcrm) v3.0.8.

## Overview

This template provides the foundation for an inventory management app with:

- **Suppliers** — vendor records with contact info and active status
- **Products** — inventory items with SKU, pricing, stock quantity, and reorder points
- **Stock Movements** — audit trail of receipts, shipments, returns, and adjustments

## Business Objects

| Object | Description |
|--------|-------------|
| `supplier` | Vendor/supplier (name, contact info, active status) |
| `product` | Inventory product (SKU, price, stock qty, reorder point, unit of measure, supplier) |
| `stock_movement` | Stock change record (type: receipt/shipment/adjustment/return, quantity, reference) |

## Getting Started

```bash
# From the repository root
pnpm install

# Run in development mode
pnpm --filter @templates/inventory dev

# Build
pnpm --filter @templates/inventory build
```

## Customization Ideas

- Add a `warehouse` or `location` object for multi-location tracking
- Add low-stock alerts via automation hooks
- Add purchase orders linked to suppliers
- Add barcode scanning support
- Add inventory valuation reports (FIFO/LIFO)
