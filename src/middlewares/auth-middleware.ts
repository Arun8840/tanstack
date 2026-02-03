import { auth } from "@/lib/auth"
import { createMiddleware } from "@tanstack/react-start"
import { redirect } from "@tanstack/react-router";


export const authFnMiddleware = createMiddleware().server(async ({ next, request }) => {
    const headers = request?.headers
    const session = await auth.api.getSession({ headers })

    if (!session) {
        throw redirect({ to: "/login" })
    }

    return next()
})


