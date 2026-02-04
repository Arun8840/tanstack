// src/routes/(dashboard)/themes/index.tsx
import { trpc } from '@/integrations/trpc/server'
import ThemeTemplates from '@/modules/themes'
import { ThemeTemplateResponse } from '@/modules/themes/types'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'


const getThemesFn = createServerFn().handler(async () => {
  const data = await trpc.themes.templates()
  return data?.data
})
export const Route = createFileRoute('/(dashboard)/themes/')({
  component: RouteComponent,
  loader: () => getThemesFn()
})

function RouteComponent() {
  const themes = Route.useLoaderData()
  return (
    <>
      <ThemeTemplates templates={themes as ThemeTemplateResponse} />
    </>
  )
}