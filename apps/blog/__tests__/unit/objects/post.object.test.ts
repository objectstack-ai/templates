import { Post } from '../../../src/post.object';

describe('Post Object Schema Validation', () => {
  it('should have correct object name', () => {
    expect(Post.name).toBe('post');
  });

  it('should have required fields defined', () => {
    expect(Post.fields).toBeDefined();
    expect(Post.fields.title).toBeDefined();
    expect(Post.fields.slug).toBeDefined();
    expect(Post.fields.content).toBeDefined();
    expect(Post.fields.status).toBeDefined();
    expect(Post.fields.author_id).toBeDefined();
  });

  it('should mark title as required', () => {
    expect(Post.fields.title.required).toBe(true);
  });

  it('should mark slug as required and unique', () => {
    expect(Post.fields.slug.required).toBe(true);
    expect(Post.fields.slug.unique).toBe(true);
  });

  it('should mark content as required', () => {
    expect(Post.fields.content.required).toBe(true);
  });

  it('should mark author_id as required', () => {
    expect(Post.fields.author_id.required).toBe(true);
  });

  it('should have correct field types', () => {
    expect(Post.fields.title.type).toBe('text');
    expect(Post.fields.content.type).toBe('textarea');
    expect(Post.fields.status.type).toBe('select');
    expect(Post.fields.published_at.type).toBe('datetime');
    expect(Post.fields.author_id.type).toBe('lookup');
    expect(Post.fields.category_id.type).toBe('lookup');
  });

  it('should have valid status options', () => {
    const values = Post.fields.status.options.map((o: any) => o.value);
    expect(values).toContain('draft');
    expect(values).toContain('published');
    expect(values).toContain('archived');
  });

  it('should default status to draft', () => {
    expect(Post.fields.status.defaultValue).toBe('draft');
  });

  it('should have author_id lookup to users', () => {
    expect(Post.fields.author_id.reference).toBe('users');
  });

  it('should have category_id lookup to category', () => {
    expect(Post.fields.category_id.reference).toBe('category');
  });

  it('should have enable flags configured', () => {
    expect(Post.enable).toBeDefined();
    expect(Post.enable.searchable).toBe(true);
    expect(Post.enable.activities).toBe(true);
  });
});
