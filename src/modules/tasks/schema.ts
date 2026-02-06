


import { z } from "zod"

export const taskItemSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().nullable().optional(),
    completed: z.boolean().optional(),
})


export type TaskItemInput = z.infer<typeof taskItemSchema>