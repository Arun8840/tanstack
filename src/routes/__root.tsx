import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'

import appCss from '../styles.css?url'

import { type QueryClient } from '@tanstack/react-query'

import type { TRPCOptionsProxy } from '@trpc/tanstack-react-query'
import { Toaster } from '@/components/ui/sonner'
import { AppRouter } from '@/integrations/trpc/router'

interface MyRouterContext {
  queryClient: QueryClient

  trpc: TRPCOptionsProxy<AppRouter>
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}

        <Toaster position="top-center" />
        <Scripts />
      </body>
    </html>
  )
}
