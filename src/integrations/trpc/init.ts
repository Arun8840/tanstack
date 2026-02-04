import { getSessionFn } from '@/lib/getSessionFn'
import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'

export async function createTRPCContext() {
  const session = await getSessionFn()
  const access_token = session?.session?.token ?? null
  const user = session?.user ?? null

  return { access_token, user }
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>

const t = initTRPC.context<Context>().create({
  transformer: superjson,
})

export const createTRPCRouter = t.router
export const createCallerFactory = t.createCallerFactory
export const publicProcedure = t.procedure

export const protectedProcedure = t.procedure.use(async function isAuthed(
  opts
) {
  const { ctx } = opts

  if (!ctx.access_token) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }

  return opts.next({
    ctx,
  })
})

