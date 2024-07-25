import { db } from '@/db/connection'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import Elysia, { t } from 'elysia'
import { z } from 'zod'

const signUpBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
})

export const signUp = new Elysia().post(
  '/sign-up',
  async ({ body, set }) => {
    const { name, email, password } = signUpBodySchema.parse(body)
    console.log(name)
    const userFromEmail = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    if (userFromEmail) {
      throw new Error('User with this e-mail already exists')
    }

    const passwordHash = await Bun.password.hash(password, 'bcrypt')
    await db.insert(users).values({
      name,
      email,
      passwordHash,
    })
    set.status = 201
  },
  {
    detail: {
      tags: ['Auth'],
    },
    body: t.Object({
      name: t.String(),
      email: t.String({ format: 'email' }),
      password: t.String({ minLength: 6 }),
    }),
  },
)
