import type {ReactNode} from "react";

export interface IModalProps {
    children: ReactNode;
    isCloseDisabled?: boolean;
    isOpen: boolean;
    title: string;
    onClose: () => void | Promise<void>;
}