# Changelog — @templates/inventory

All notable changes to this template will be documented in this file.

## [1.0.0] — 2026-02-24

### Added
- Initial release of the inventory management template
- `supplier` object — vendor records with contact info and active status
- `product` object — products with SKU, pricing, stock levels, and reorder points
- `stock_movement` object — stock change audit trail (receipt, shipment, adjustment, return)
- Plugin definition with stock and vendor navigation groups
- Standalone `objectstack.config.ts` for local development
