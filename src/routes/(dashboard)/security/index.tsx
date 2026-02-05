import { getSessionFn } from '@/lib/getSessionFn'
import Security from '@/modules/security'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

const getUserFn = createServerFn().handler(async () => {
    const session = await getSessionFn()
    return session?.user
})
export const Route = createFileRoute('/(dashboard)/security/')({
    component: RouteComponent,
    loader: () => getUserFn()
})

function RouteComponent() {
    const user = Route.useLoaderData()
    return <Security user={user} />
}
