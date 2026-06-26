import type {ButtonHTMLAttributes} from "react";

export interface IButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: TButtonVariant;
    size?: TButtonSize;
    isFullWidth?: boolean;
}

export type TButtonVariant = 'primary' | 'secondary';
export type TButtonSize = 'medium' | 'large';