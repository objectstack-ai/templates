import { ObjectSchema, Field } from '@objectstack/spec/data';

export const Category = ObjectSchema.create({
  name: 'category',
  label: 'Category',
  pluralLabel: 'Categories',
  icon: 'tag',
  description: 'Blog post category',

  fields: {
    name: Field.text({
      label: 'Name',
      required: true,
      unique: true,
      maxLength: 100,
    }),
    slug: Field.text({
      label: 'Slug',
      required: true,
      unique: true,
      maxLength: 100,
    }),
    description: Field.textarea({
      label: 'Description',
    }),
    parent_id: Field.lookup('category', {
      label: 'Parent Category',
    }),
  },

  enable: {
    searchable: true,
  },
});
