import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'

import { z } from 'zod'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth-client'
import { Spinner } from '@/components/ui/spinner'
import { Label } from '@/components/ui/label'
import { useNavigate } from '@tanstack/react-router'

const verifySchema = z.object({
  code: z
    .string({ error: "Code is required" })
    .min(6, "Code must be exactly 6 digits")
    .max(6, "Code must be exactly 6 digits")
    .regex(/^\d{6}$/, "Code must be 6 digits"),
})

type VerifyInputForm = z.infer<typeof verifySchema>
export function OTPForm({ className, ...props }: React.ComponentProps<'div'>) {
  const navigate = useNavigate()
  const form = useForm<VerifyInputForm>({
    defaultValues: { code: "" },
    resolver: zodResolver(verifySchema),
    mode: "onTouched",
  })

  const { control, handleSubmit, formState: { errors, isSubmitting } } = form

  const verifyCode: SubmitHandler<VerifyInputForm> = async ({ code }) => {
    try {
      const { data } = await authClient.twoFactor.verifyTotp({
        code,
        trustDevice: false,
      })

      if (!data?.token) {
        toast.success("Invalid Code !")
        // navigate({ to: "/login" })
        return
      }

      toast.success("Verification successful!")
      navigate({ to: "/" })
    } catch (error) {
      toast.error("Invalid or expired code")
    }
  }


  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <form onSubmit={handleSubmit(verifyCode)} className="w-full">
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <Label className="text-2xl font-semibold">Enter verification code</Label>
            <p className="text-muted-foreground text-sm text-balance">
              We sent a 6-digit code to your email.
            </p>
          </div>
          <Field className="size-fit mx-auto" data-invalid={!!errors.code}>
            <FieldLabel htmlFor="otp" className="sr-only">
              Verification code
            </FieldLabel>
            <Controller
              name="code"
              control={control}
              render={({ field, fieldState }) => (
                <InputOTP
                  maxLength={6}
                  id="otp"
                  value={field.value}
                  onChange={field.onChange}
                  aria-invalid={!!fieldState.error}
                  autoFocus
                >
                  <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              )}
            />
            <FieldDescription className="text-center py-2">
              Enter the 6-digit code in your authenticator app.
            </FieldDescription>
            {errors.code && (
              <FieldError errors={[errors.code]} className='text-center pb-2' />
            )}
          </Field>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Spinner />} Verify
          </Button>
          <FieldDescription className="text-center">
            Didn&apos;t receive the code? <a href="#">Resend</a>
          </FieldDescription>
        </FieldGroup>
      </form>
    </div>
  )
}
