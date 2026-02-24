import { ObjectSchema, Field } from '@objectstack/spec/data';

export const StockMovement = ObjectSchema.create({
  name: 'stock_movement',
  label: 'Stock Movement',
  pluralLabel: 'Stock Movements',
  icon: 'arrow-right-left',
  description: 'Records stock quantity changes — receipts, shipments, and adjustments',

  fields: {
    product_id: Field.lookup('product', {
      label: 'Product',
      required: true,
    }),
    movement_type: Field.select({
      label: 'Type',
      required: true,
      options: [
        { label: 'Receipt', value: 'receipt' },
        { label: 'Shipment', value: 'shipment' },
        { label: 'Adjustment', value: 'adjustment' },
        { label: 'Return', value: 'return' },
      ],
    }),
    quantity: Field.number({
      label: 'Quantity',
      required: true,
      precision: 0,
    }),
    reference: Field.text({
      label: 'Reference',
      maxLength: 100,
    }),
    notes: Field.textarea({
      label: 'Notes',
    }),
    moved_at: Field.datetime({
      label: 'Moved At',
      required: true,
      defaultValue: '$now',
    }),
    created_by: Field.lookup('users', {
      label: 'Created By',
      required: true,
      defaultValue: '$currentUser',
      readonly: true,
    }),
  },

  enable: {
    searchable: false,
    trackHistory: false,
  },
});
