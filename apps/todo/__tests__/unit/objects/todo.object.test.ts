import { Todo } from '../../../src/todo.object';

describe('Todo Object Schema Validation', () => {
  it('should have correct object name', () => {
    expect(Todo.name).toBe('todo');
  });

  it('should have required fields defined', () => {
    expect(Todo.fields).toBeDefined();
    expect(Todo.fields.title).toBeDefined();
    expect(Todo.fields.status).toBeDefined();
    expect(Todo.fields.priority).toBeDefined();
    expect(Todo.fields.owner_id).toBeDefined();
  });

  it('should mark title as required', () => {
    expect(Todo.fields.title.required).toBe(true);
  });

  it('should mark owner_id as required', () => {
    expect(Todo.fields.owner_id.required).toBe(true);
  });

  it('should have correct field types', () => {
    expect(Todo.fields.title.type).toBe('text');
    expect(Todo.fields.description.type).toBe('textarea');
    expect(Todo.fields.status.type).toBe('select');
    expect(Todo.fields.priority.type).toBe('select');
    expect(Todo.fields.due_date.type).toBe('date');
    expect(Todo.fields.owner_id.type).toBe('lookup');
  });

  it('should have valid status options', () => {
    const values = Todo.fields.status.options.map((o: any) => o.value);
    expect(values).toContain('open');
    expect(values).toContain('in_progress');
    expect(values).toContain('done');
    expect(values).toContain('cancelled');
  });

  it('should have valid priority options', () => {
    const values = Todo.fields.priority.options.map((o: any) => o.value);
    expect(values).toContain('low');
    expect(values).toContain('medium');
    expect(values).toContain('high');
  });

  it('should default status to open', () => {
    expect(Todo.fields.status.defaultValue).toBe('open');
  });

  it('should default priority to medium', () => {
    expect(Todo.fields.priority.defaultValue).toBe('medium');
  });

  it('should have owner_id lookup to users', () => {
    expect(Todo.fields.owner_id.reference).toBe('users');
  });

  it('should have enable flags configured', () => {
    expect(Todo.enable).toBeDefined();
    expect(Todo.enable.searchable).toBe(true);
    expect(Todo.enable.activities).toBe(true);
  });
});
