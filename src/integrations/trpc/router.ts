
import { securityRouter } from '@/modules/security/procedures';
import { createTRPCRouter } from './init'

import { themesRouter } from '@/modules/themes/procedures'
import { taskRouter } from '@/modules/tasks/procedure';


export const appRouter = createTRPCRouter({
  themes: themesRouter,
  security: securityRouter,
  tasks: taskRouter
})
export type AppRouter = typeof appRouter;
