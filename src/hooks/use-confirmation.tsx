import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import React, { useState, JSX } from "react";

type Variant =
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";

type ConfirmationDialogProps = { children: React.ReactNode };


export const useConfirm = (
    title: string,
    description: string,
    variant: Variant
): [
        ({ children }: ConfirmationDialogProps) => JSX.Element,
        () => Promise<boolean>
    ] => {
    const [promise, setPromise] = useState<{
        resolve: (value: boolean) => void;
    } | null>(null);

    const [isOpen, setIsOpen] = useState(false);

    const confirm = () => {
        return new Promise<boolean>((resolve) => {
            setPromise({ resolve });
            setIsOpen(true);
        });
    };
    const handleConfirm = () => {
        promise?.resolve(true)
        handleClose()
    }


    const handleClose = () => {
        setPromise(null);
        setIsOpen(false);
    };
    const handleCancel = (
        e?: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        if (e) e.preventDefault();
        promise?.resolve(false);
        handleClose();
    };

    const ConfirmationDialog = ({
        children,
    }: ConfirmationDialogProps): JSX.Element => {
        return (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>{description}</DialogDescription>
                    </DialogHeader>
                    <div>{children}</div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button onClick={handleConfirm} variant={variant} type="submit">
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    };

    return [ConfirmationDialog, confirm];
};
