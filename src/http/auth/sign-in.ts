import { db } from '@/db/connection'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import Elysia, { t } from 'elysia'
import { auth } from '../authentication'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'

export const signIn = new Elysia().use(auth).post(
  '/sign-in',
  async ({ body, cookie: { auth }, jwt }) => {
    const { email, password } = body
    console.log(email)
    const userFromEmail = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    if (!userFromEmail) {
      throw new InvalidCredentialsError()
    }
    if (userFromEmail.passwordHash === null) {
      throw new InvalidCredentialsError()
    }
    const isPasswordValid = await Bun.password.verify(
      password,
      userFromEmail.passwordHash,
      'bcrypt',
    )
    if (!isPasswordValid) {
      throw new InvalidCredentialsError()
    }
    const token = await jwt.sign({
      sub: userFromEmail.id,
    })

    auth.value = token
    auth.httpOnly = true
    auth.maxAge = 60 * 60 * 24 * 7 // 7 days
    auth.path = '/'

    return { token }
  },
  {
    detail: {
      tags: ['Auth'],
    },
    body: t.Object({
      email: t.String({ format: 'email' }),
      password: t.String({ minLength: 6 }),
    }),
    response: t.Object({
      token: t.String(),
    }),
  },
)
