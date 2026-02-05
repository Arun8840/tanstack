import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import { Spinner } from '@/components/ui/spinner'
import { authClient } from '@/lib/auth-client'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { SetStateAction } from 'react'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

interface VerifyFormProps {
    totpURI: string
    setTotpURI: (value: SetStateAction<string | null>) => void
}


const verifySchema = z.object({
    code: z
        .string({ error: "Code is required" })
        .min(6, "Code must be exactly 6 digits")
        .max(6, "Code must be exactly 6 digits")
        .regex(/^\d{6}$/, "Code must be 6 digits"),
})

type VerifyInputForm = z.infer<typeof verifySchema>

const VerifyForm: React.FC<VerifyFormProps> = ({ totpURI, setTotpURI }) => {
    const form = useForm<VerifyInputForm>({
        defaultValues: { code: "" },
        resolver: zodResolver(verifySchema),
        mode: "onTouched",
    })

    const { control, handleSubmit, formState: { errors, isSubmitting } } = form

    const verifyCode: SubmitHandler<VerifyInputForm> = async (data) => {
        await authClient.twoFactor.verifyTotp({
            code: data?.code,
        });
        toast.success("Twofactor Enabled Successfully!")
        setTotpURI(null)
    }

    return (
        <div className="flex flex-col items-center gap-4 w-full lg:max-w-lg lg:mx-auto">
            {/* //*QR IMAGE */}
            <div className="size-50 bg-card border border-muted rounded-lg p-1">
                <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(totpURI)}`}
                    className="size-full object-center"
                    alt="Authenticator QR"
                />
            </div>
            <form onSubmit={handleSubmit(verifyCode)} className="w-full">
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
                        Enter the 6-digit code sent to your authenticator app.
                    </FieldDescription>
                    {errors.code && (
                        <FieldError errors={[errors.code]} className='text-center pb-2' />
                    )}
                </Field>
                <Field>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting && <Spinner />} Verify
                    </Button>
                </Field>
            </form>
        </div>
    )
}

export default VerifyForm