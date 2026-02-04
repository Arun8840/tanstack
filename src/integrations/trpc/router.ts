
import { createTRPCRouter } from './init'

import { themesRouter } from '@/modules/themes/procedures'


export const appRouter = createTRPCRouter({
  themes: themesRouter,
})
export type AppRouter = typeof appRouter;
