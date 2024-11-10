import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const tasks = sqliteTable('tasks', {
  id: integer('id', { mode: 'number' })
    .primaryKey({ autoIncrement: true }),
  name: text('name')
    .notNull(),
  done: integer('done', { mode: 'boolean' })
    .notNull()
    .default(false),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$default(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$default(() => new Date())
    .$onUpdate(() => new Date()),
});

// create a Zod schema from our 'tasks' table definition.
export const selectTasksSchema = createSelectSchema(tasks);

// omit id,createdAt,UpdatedAt when inserting a new tasks.
export const insertTasksSchema = createInsertSchema(tasks, {
  // 2nd argument accepts an object and select any column to modify any validator.
  // as of now, set the minimum length of the name and max.
  name: schema => schema.name.min(1).max(100),
})
  .required({
    done: true, // done property has a default property, but it should be required, when posting.
  })
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  });
// partial method in zod, allows for optional properties. which is needed when doing an update/patch
export const updateTaskSchema = insertTasksSchema.partial();
