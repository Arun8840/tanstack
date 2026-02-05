
import { securityRouter } from '@/modules/security/procedures';
import { createTRPCRouter } from './init'

import { themesRouter } from '@/modules/themes/procedures'


export const appRouter = createTRPCRouter({
  themes: themesRouter,
  security: securityRouter,
})
export type AppRouter = typeof appRouter;
