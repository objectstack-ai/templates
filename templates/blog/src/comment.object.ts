import { ObjectSchema, Field } from '@objectstack/spec/data';

export const Comment = ObjectSchema.create({
  name: 'comment',
  label: 'Comment',
  pluralLabel: 'Comments',
  icon: 'message-square',
  description: 'Reader comment on a blog post',

  fields: {
    content: Field.textarea({
      label: 'Content',
      required: true,
    }),
    status: Field.select({
      label: 'Status',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
    }),
    post_id: Field.lookup('post', {
      label: 'Post',
      required: true,
    }),
    author_name: Field.text({
      label: 'Author Name',
      required: true,
      maxLength: 100,
    }),
    author_email: Field.email({
      label: 'Author Email',
      required: true,
    }),
    parent_id: Field.lookup('comment', {
      label: 'Reply To',
    }),
  },

  enable: {
    searchable: false,
    trackHistory: false,
  },
});
