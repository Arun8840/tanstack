import 'dotenv/config'
import * as schema from '@/integrations/db/schema'
import { betterAuth } from 'better-auth'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { nextCookies } from 'better-auth/next-js'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '@/integrations/db'
import { twoFactor } from 'better-auth/plugins'
export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET!,
  appName: 'project-auth',
  emailAndPassword: {
    enabled: true,
  },
  plugins: [twoFactor(), nextCookies(), tanstackStartCookies()],
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: schema,
  }),
})
