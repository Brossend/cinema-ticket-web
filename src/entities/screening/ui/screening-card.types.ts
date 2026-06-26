import type {IScreening} from "@/entities/screening";
import type {ReactNode} from "react";

export interface IScreeningCardProps {
    screening: IScreening;
    actions?: ReactNode;
}