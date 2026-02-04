import { OTPForm } from '@/modules/auth/otp-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/two-mfa/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="max-w-sm w-full">
      <OTPForm />
    </div>
  )
}
