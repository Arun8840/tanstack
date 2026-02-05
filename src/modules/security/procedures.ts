import { db } from "@/integrations/db";
import { user } from "@/integrations/db/schema";
import { protectedProcedure } from "@/integrations/trpc/init";
import { TRPCError, TRPCRouterRecord } from "@trpc/server";
import { eq } from "drizzle-orm";

export const securityRouter = {
    getUser: protectedProcedure.query(async ({ ctx }) => {
        const { access_token, user: loggedUser } = ctx;

        if (!access_token || !loggedUser?.id) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "Unauthorized",
            });
        }

        const currentUser = await db
            .select()
            .from(user)
            .where(eq(user.id, loggedUser.id))
            .then((users) => users[0]);

        if (!currentUser) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "User not found",
            });
        }

        return currentUser;
    }),
} satisfies TRPCRouterRecord;
