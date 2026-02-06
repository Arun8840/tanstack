import Security from '@/modules/security'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(dashboard)/security/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Security />
}
