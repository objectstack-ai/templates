import { ObjectSchema, Field } from '@objectstack/spec/data';

export const Supplier = ObjectSchema.create({
  name: 'supplier',
  label: 'Supplier',
  pluralLabel: 'Suppliers',
  icon: 'truck',
  description: 'Vendor or supplier of inventory products',

  fields: {
    name: Field.text({
      label: 'Name',
      required: true,
      unique: true,
      maxLength: 255,
    }),
    contact_name: Field.text({
      label: 'Contact Name',
      maxLength: 100,
    }),
    email: Field.email({
      label: 'Email',
    }),
    phone: Field.phone({
      label: 'Phone',
    }),
    website: Field.url({
      label: 'Website',
    }),
    address: Field.textarea({
      label: 'Address',
    }),
    notes: Field.textarea({
      label: 'Notes',
    }),
    is_active: Field.boolean({
      label: 'Active',
      defaultValue: true,
    }),
  },

  enable: {
    searchable: true,
  },
});
