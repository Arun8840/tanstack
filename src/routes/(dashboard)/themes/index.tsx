import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(dashboard)/themes/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(dashboard)/themes/"!</div>
}
