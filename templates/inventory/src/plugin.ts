import { Supplier } from './supplier.object.js';
import { Product } from './product.object.js';
import { StockMovement } from './stock_movement.object.js';

export const InventoryPlugin = {
  name: 'inventory',
  label: 'Inventory',
  version: '1.0.0',
  description: 'Inventory management — products, suppliers, and stock movement tracking',

  dependencies: [],

  init: async () => {},

  actions: {},
  triggers: {},
  workflows: {},

  objects: {
    supplier: Supplier,
    product: Product,
    stock_movement: StockMovement,
  },

  apps: [
    {
      name: 'inventory',
      label: 'Inventory',
      navigation: [
        {
          id: 'stock',
          type: 'group',
          label: 'Stock',
          children: [
            { id: 'product', label: 'Products', type: 'object', objectName: 'product' },
            { id: 'stock_movement', label: 'Stock Movements', type: 'object', objectName: 'stock_movement' },
          ],
        },
        {
          id: 'vendors',
          type: 'group',
          label: 'Vendors',
          children: [
            { id: 'supplier', label: 'Suppliers', type: 'object', objectName: 'supplier' },
          ],
        },
      ],
    },
  ],
};

export default InventoryPlugin;
