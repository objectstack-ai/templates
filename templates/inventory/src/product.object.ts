import { ObjectSchema, Field } from '@objectstack/spec/data';

export const Product = ObjectSchema.create({
  name: 'product',
  label: 'Product',
  pluralLabel: 'Products',
  icon: 'box',
  description: 'Inventory product with SKU, pricing, and stock tracking',

  fields: {
    name: Field.text({
      label: 'Name',
      required: true,
      maxLength: 255,
    }),
    sku: Field.text({
      label: 'SKU',
      required: true,
      unique: true,
      maxLength: 100,
    }),
    description: Field.textarea({
      label: 'Description',
    }),
    category: Field.select({
      label: 'Category',
      options: [
        { label: 'Electronics', value: 'electronics' },
        { label: 'Clothing', value: 'clothing' },
        { label: 'Food & Beverage', value: 'food_beverage' },
        { label: 'Office Supplies', value: 'office_supplies' },
        { label: 'Tools & Hardware', value: 'tools_hardware' },
        { label: 'Other', value: 'other' },
      ],
    }),
    unit_price: Field.currency({
      label: 'Unit Price',
      required: true,
      precision: 2,
    }),
    cost_price: Field.currency({
      label: 'Cost Price',
      precision: 2,
    }),
    stock_quantity: Field.number({
      label: 'Stock Quantity',
      defaultValue: 0,
      min: 0,
      precision: 0,
    }),
    reorder_point: Field.number({
      label: 'Reorder Point',
      defaultValue: 10,
      min: 0,
      precision: 0,
    }),
    unit_of_measure: Field.select({
      label: 'Unit of Measure',
      defaultValue: 'each',
      options: [
        { label: 'Each', value: 'each' },
        { label: 'Kilogram', value: 'kg' },
        { label: 'Gram', value: 'g' },
        { label: 'Liter', value: 'L' },
        { label: 'Meter', value: 'm' },
        { label: 'Box', value: 'box' },
        { label: 'Carton', value: 'carton' },
      ],
    }),
    supplier_id: Field.lookup('supplier', {
      label: 'Supplier',
    }),
    is_active: Field.boolean({
      label: 'Active',
      defaultValue: true,
    }),
  },

  enable: {
    searchable: true,
    trackHistory: true,
    activities: false,
    feeds: false,
  },
});
