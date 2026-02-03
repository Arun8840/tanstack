import { z } from "zod"

export const RegisterSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters"),
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    password: z
        .string()
        .min(4, "Password must be at least 4 characters"),
    confirmPassword: z
        .string()
        .min(8, "Confirm Password must be at least 8 characters")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

export type RegisterInputs = z.infer<typeof RegisterSchema>