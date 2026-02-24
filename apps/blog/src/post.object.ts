import { ObjectSchema, Field } from '@objectstack/spec/data';

export const Post = ObjectSchema.create({
  name: 'post',
  label: 'Post',
  pluralLabel: 'Posts',
  icon: 'file-text',
  description: 'A blog post or article',

  fields: {
    title: Field.text({
      label: 'Title',
      required: true,
      maxLength: 255,
    }),
    slug: Field.text({
      label: 'Slug',
      required: true,
      unique: true,
      maxLength: 255,
    }),
    content: Field.textarea({
      label: 'Content',
      required: true,
    }),
    excerpt: Field.textarea({
      label: 'Excerpt',
    }),
    status: Field.select({
      label: 'Status',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
    }),
    published_at: Field.datetime({
      label: 'Published At',
    }),
    cover_image: Field.url({
      label: 'Cover Image URL',
    }),
    author_id: Field.lookup('users', {
      label: 'Author',
      required: true,
      defaultValue: '$currentUser',
    }),
    category_id: Field.lookup('category', {
      label: 'Category',
    }),
    tags: Field.text({
      label: 'Tags',
      maxLength: 500,
    }),
    view_count: Field.number({
      label: 'View Count',
      defaultValue: 0,
      min: 0,
      readonly: true,
    }),
  },

  enable: {
    searchable: true,
    trackHistory: true,
    activities: true,
  },
});
