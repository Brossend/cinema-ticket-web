import type {IScreening} from "@/entities/screening";

export interface ICreateReservationButtonProps {
    isCreating: boolean;
    isDisabled: boolean;
    screening: IScreening;
    onStartReservation: (screening: IScreening) => void;
}