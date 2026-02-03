import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(dashboard)')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='border border-black'>
    <Outlet />
  </div>
}
