import { db } from "@/integrations/db"
import { themes } from "@/integrations/db/schema"
import { publicProcedure } from "@/integrations/trpc/init"
import { TRPCRouterRecord } from "@trpc/server"
import z from "zod"


export const themesRouter = {
    templates: publicProcedure.query(async () => {
        const data = await db.select().from(themes)

        return {
            status: true,
            message: "Themes fetched successfully",
            data: data
        }
    }),
    create: publicProcedure
        .input(z.object({ name: z.string() }))
        .mutation(({ input }) => {
            const { name } = input

            return `template created has ${name}`
        })
} satisfies TRPCRouterRecord
