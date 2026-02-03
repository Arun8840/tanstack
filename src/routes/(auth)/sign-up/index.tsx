import { SignupForm } from '@/modules/auth/sign-up-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/sign-up/')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div className="max-w-sm w-full">
        <SignupForm />
    </div>
}
