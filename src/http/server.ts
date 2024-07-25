import { Elysia, redirect, t } from 'elysia'
import { signIn } from './auth/sign-in'
import { signUp } from './auth/sign-up'
import swagger from '@elysiajs/swagger'
import { signOut } from './auth/sign-out'
import { getProfile } from './auth/get-profile'
import jwt from '@elysiajs/jwt'
import { env } from '@/env'

const app = new Elysia()
  .use(
    jwt({
      secret: env.JWT_SECRET_KEY,
      schema: t.Object({
        sub: t.String(),
      }),
    }),
  )
  .get('/', () => {
    return redirect('/swagger')
  })
  .use(swagger())
  .use(signIn)
  .use(signUp)
  .use(signOut)
  .use(getProfile)
  .onError(({ code, error, set }) => {
    switch (code) {
      case 'VALIDATION': {
        set.status = error.status

        return error.toResponse()
      }
      case 'NOT_FOUND': {
        return new Response(null, { status: 404 })
      }
      default: {
        console.error(error)

        return new Response(null, { status: 500 })
      }
    }
  })

app.listen(8080)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
)
