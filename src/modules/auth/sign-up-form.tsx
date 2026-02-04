import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth-client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { RegisterInputs, RegisterSchema } from './schema/sign-up'
import { Spinner } from '@/components/ui/spinner'

export function SignupForm() {
  const form = useForm<RegisterInputs>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
    },
    resolver: zodResolver(RegisterSchema),
  })

  const isPending = form.formState.isSubmitting

  const createUser: SubmitHandler<RegisterInputs> = async (data) => {
    try {
      await authClient.signUp.email(
        {
          email: data?.email,
          name: data?.name,
          password: data?.password,
          callbackURL: '/login',
        },
        {
          onSuccess: () => {
            toast.success('Logged in successfully!')
          },
          onError: (error) => {
            const e = error as unknown as Error
            toast.error(e?.message || 'An unknown error occurred during login.')
          },
        },
      )
    } catch (error) {
      const e = error as Error
      toast.error(e?.message || 'An unknown error occurred during login.')
    }
  }
  return (
    <form onSubmit={form.handleSubmit(createUser)}>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="text"
                placeholder="John Doe"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && fieldState.error && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Email</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="email"
                placeholder="m@example.com"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && fieldState.error && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Password</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="password"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && fieldState.error && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="password"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && fieldState.error && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <FieldGroup>
          <Field>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {isPending && <Spinner />}
              Create Account
            </Button>
            <Button variant="outline" type="button">
              Sign up with Google
            </Button>
            <FieldDescription className="px-6 text-center">
              Already have an account? <a href="#">Sign in</a>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </FieldGroup>
    </form>
  )
}
