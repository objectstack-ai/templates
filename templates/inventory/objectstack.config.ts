import { defineStack } from '@objectstack/spec';
import { InventoryPlugin } from './src/plugin.js';

export default defineStack({
  manifest: {
    id: 'com.templates.inventory',
    namespace: 'inventory',
    version: '1.0.0',
    type: 'plugin',
    name: 'Inventory',
    description: 'Inventory management app — products, suppliers, and stock movement tracking',
  },

  // Empty objects array triggers auto-loading of ObjectQL and the memory driver.
  // Business objects are defined inside the plugin's objects[] property.
  objects: [],

  plugins: [InventoryPlugin],
  // Uses 'as any' because defineStack schema doesn't include runtime plugin shape —
  // consistent with the @objectstack/hotcrm pattern.
} as any);
