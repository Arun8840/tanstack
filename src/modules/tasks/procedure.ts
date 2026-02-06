import { db } from "@/integrations/db"
import { tasks } from "@/integrations/db/schema"
import { protectedProcedure } from "@/integrations/trpc/init"
import { TRPCError, TRPCRouterRecord } from "@trpc/server"
import { eq } from "drizzle-orm"
import z from "zod"
import { taskItemSchema } from "./schema"


export const taskRouter = {
    getAllTasks: protectedProcedure.query(async ({ ctx }) => {
        const { access_token } = ctx

        if (!access_token) {
            throw new TRPCError({ code: "UNAUTHORIZED", message: "Access token is missing. Please log in to continue." })
        }
        const data = await db.select().from(tasks)

        return {
            status: true,
            message: "Tasks fetched successfully",
            data: data
        }
    }),

    create: protectedProcedure
        .input(taskItemSchema)
        .mutation(async ({ input, ctx }) => {

            if (!ctx?.access_token || !ctx?.user?.id) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Access token is missing. Please log in to continue.",
                });
            }
            debugger
            const body = {
                ...input,
                id: crypto.randomUUID(),
                assigneeId: ctx.user.id,
                completed: input.completed ?? false,
            }
            debugger
            const [newTask] = await db
                .insert(tasks)
                .values({ ...body })
                .returning();

            return {
                status: true,
                message: "Task created successfully",
                data: newTask,
            };
        }),

    remove: protectedProcedure
        .input(z.object({ taskId: z.string() }))
        .mutation(async ({ input, ctx }) => {

            if (!ctx?.access_token) {
                throw new TRPCError({ code: "UNAUTHORIZED", message: "Access token is missing. Please log in to continue." })
            }
            const { taskId } = input
            if (!taskId) {
                throw new TRPCError({ code: "BAD_REQUEST", message: "Task ID is required for removal." })
            }
            const result = await db
                .delete(tasks)
                .where(eq(tasks.id, taskId))
                .returning({ id: tasks.id })

            if (result.length === 0) {
                throw new Error("Task not found")
            }

            return {
                message: "Task removed successfully",
                data: result
            }
        })
} satisfies TRPCRouterRecord
