import { QueryClient } from '@tanstack/react-query'
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import { AppRouter } from './router'
import SuperJSON from 'superjson'

export const queryClient = new QueryClient()

function getUrl() {
  const base = (() => {
    if (typeof window !== 'undefined') return ''
    if (process.env.NEXT_CLIENT_SERVICE_BASE_URL)
      return process.env.NEXT_CLIENT_SERVICE_BASE_URL
    return 'http://localhost:3000'
  })()
  return `${base}/api/trpc`
}

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      transformer: SuperJSON,
      url: getUrl(),
    }),
  ],
})

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
})