import type {InputHTMLAttributes} from "react";

export interface IInputProps
    extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    errorMessage?: string;
}