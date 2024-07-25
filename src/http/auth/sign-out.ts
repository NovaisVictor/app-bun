import Elysia from 'elysia'
import { auth } from '../authentication'

export const signOut = new Elysia().use(auth).post(
  '/sign-out',
  async ({ signOut: internalSignOut }) => {
    internalSignOut()
  },
  {
    detail: {
      tags: ['Auth'],
    },
  },
)
