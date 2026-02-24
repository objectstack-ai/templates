import { ObjectSchema, Field } from '@objectstack/spec/data';

export const Post = ObjectSchema.create({
  name: 'post',
  label: 'Post',
  pluralLabel: 'Posts',
  icon: 'file-text',
  description: 'Blog post with rich content and publishing workflow',

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
    summary: Field.textarea({
      label: 'Summary',
      maxLength: 500,
    }),
    content: Field.textarea({
      label: 'Content',
      required: true,
    }),
    status: Field.select({
      label: 'Status',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Review', value: 'review' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
    }),
    published_at: Field.datetime({
      label: 'Published At',
      readonly: true,
    }),
    category_id: Field.lookup('category', {
      label: 'Category',
    }),
    author_id: Field.lookup('users', {
      label: 'Author',
      required: true,
      defaultValue: '$currentUser',
    }),
    featured_image: Field.url({
      label: 'Featured Image URL',
    }),
    tags: Field.text({
      label: 'Tags',
      maxLength: 500,
    }),
  },

  enable: {
    searchable: true,
    trackHistory: true,
    activities: false,
    feeds: false,
  },
});
