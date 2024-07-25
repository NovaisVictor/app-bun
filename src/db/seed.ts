/* eslint-disable drizzle/enforce-delete-with-where */

import { tasks, users } from './schema'
import { faker } from '@faker-js/faker'
import { db } from './connection'
import chalk from 'chalk'

/**
 * Reset database
 */

await db.delete(tasks)
await db.delete(users)

console.log(chalk.yellow('✔ Database reset'))

/**
 * Create users
 */
const user = await db
  .insert(users)
  .values({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    passwordHash: faker.internet.password(),
    avatarUrl: faker.image.avatarGitHub(),
  })
  .returning()

console.log(chalk.yellow('✔ Created users'))

await db.insert(tasks).values({
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  userId: user[0].id,
})

console.log(chalk.yellow('✔ Created tasks'))

console.log(chalk.greenBright('Database seeded successfully!'))

process.exit()
