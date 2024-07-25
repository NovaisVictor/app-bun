import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'

import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const usersRelations = relations(users, ({ many }) => ({
  tasks: many(tasks),
}))

export const tasks = pgTable('tasks', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text('user_id').references(() => users.id, {
    onDelete: 'set null',
  }),
  name: text('name').notNull(),
  description: text('description').notNull(),
  isComplete: boolean('is_complete').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
}))
