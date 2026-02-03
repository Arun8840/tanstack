import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import * as TanstackQuery from './integrations/tanstack-query/root-provider'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import NotFound from './components/not-found'
import DefaultLoader from './components/defaul-loader'

// Create a new router instance
export const getRouter = () => {
  const rqContext = TanstackQuery.getContext()

  const router = createRouter({
    routeTree,
    context: {
      ...rqContext,
    },

    defaultPreload: 'intent',
    defaultNotFoundComponent: NotFound,
    defaultPendingComponent: DefaultLoader
  })

  setupRouterSsrQueryIntegration({ router, queryClient: rqContext.queryClient })

  return router
}
