import { Label } from "@/components/ui/label";
import { UserResponse } from "./types";
import { Lock, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth-client";
import { useConfirm } from "@/hooks/use-confirmation";
import { Controller, Form, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";
import VerifyForm from "./verify-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SecurityProps {
    user: UserResponse
}

const MFAschema = z.object({
    password: z.string().min(1, "Password Required")
})
type MFAtypeInput = z.infer<typeof MFAschema>

function Security({ user }: SecurityProps) {
    const isEnabled = user?.twoFactorEnabled ?? false
    const [totpURI, setTotpURI] = useState<string | null>(null);
    const form = useForm<MFAtypeInput>({
        defaultValues: {
            password: ""
        },
        resolver: zodResolver(MFAschema)
    })

    const [ConfirmEnabeModal, confirm] = useConfirm(
        "Enable Two-Factor Authentication",
        "Are you sure you want to enable two-factor authentication? This will add an extra layer of security to your account.",
        "default"
    )

    const enable2MFA = async (checked: boolean) => {
        const confirmed = await confirm();
        const password = form.getValues("password");
        if (!password) {
            toast.error("Please enter your password.");
            return;
        }

        if (checked) {

            if (!confirmed) return;

            try {
                const { data } = await authClient.twoFactor.enable({
                    password,
                    issuer: "project-auth"
                });
                if (data?.totpURI) {
                    setTotpURI(data.totpURI);
                }
                toast.success("Two-factor authentication enabled.");
            } catch (error) {
                toast.error("Failed to enable two-factor authentication.");
            }
        } else {
            try {
                await authClient.twoFactor.disable({ password });
                toast.success("Two-factor authentication disabled.");
            } catch (error) {
                toast.error("Failed to disable two-factor authentication.");
            }
        }
    }



    const CreateMFAForm = () => {
        return <Form {...form}>
            <FieldGroup>
                <Controller
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Enter Current Password</FieldLabel>
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
            </FieldGroup>
        </Form>
    }
    return (
        <div className="size-full gap-3">
            <ConfirmEnabeModal>
                <CreateMFAForm />
            </ConfirmEnabeModal>
            {/* //* card */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        <div className="flex items-center gap-x-2">
                            <Button size={"icon-sm"} variant={"secondary"}>
                                <Shield stroke="blue" />
                            </Button>
                            <Label className="text-xl p-0 font-semibold">
                                Profile  Security
                            </Label>
                        </div>
                    </CardTitle>
                    <CardDescription>
                        View and manage your account details, security settings, and personal information associated with this profile.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">

                    <div className="flex  gap-3">
                        <Avatar className="size-40 rounded-xl">
                            <AvatarImage
                                src={user?.image ?? "https://github.com/shadcn.png"}
                                alt="@shadcn"
                            />
                            <AvatarFallback className="text-xl font-semibold rounded-xl">
                                {user?.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 flex flex-col justify-between gap-3">
                            <div className="space-y-3">
                                <h1 className="text-xl font-semibold">{user?.name}</h1>
                                <div className="flex items-center gap-x-2">
                                    <Badge aria-checked={user?.emailVerified} className="bg-red-500/20 text-red-500 aria-checked:bg-green-500/20 aria-checked:text-green-500">
                                        <Star />
                                        {user?.emailVerified ? "Verified" : "Not Verified"}
                                    </Badge>

                                    <Badge aria-checked={!!user?.twoFactorEnabled} className="bg-red-500/20 text-red-500 aria-checked:bg-green-500/20 aria-checked:text-green-500">
                                        <Lock />
                                        2MFA Enabled
                                    </Badge>
                                </div>
                                <p className="text-muted-foreground text-sm">{user?.email}</p>
                            </div>
                            <div className="flex justify-end items-center gap-2">
                                <Button type="button" variant={"outline"}>
                                    Update
                                </Button>
                                <Button disabled type="button" variant={"destructive"}>
                                    Logout
                                </Button>
                            </div>
                        </div>
                    </div>

                    <Separator />
                    {totpURI ?
                        <VerifyForm totpURI={totpURI} setTotpURI={setTotpURI} />
                        :
                        <>
                            <div>
                                <Label className="text-base font-semibold">Two-Factor Authentication</Label>
                                <p className="text-sm text-muted-foreground">
                                    Add an extra layer of security to your account by enabling two-factor authentication (2FA).
                                </p>
                            </div>
                            <div className="flex items-center justify-between pr-3">
                                <Label htmlFor="switch-to-enable">Enable</Label>
                                <Switch onCheckedChange={enable2MFA} id="switch-to-enable" checked={isEnabled} />
                            </div>
                        </>}

                </CardContent>
            </Card>
        </div>
    );
}

export default Security;