
export interface UserType {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined;
    twoFactorEnabled?: boolean | null | undefined;
}

export type UserResponse = UserType | null;
