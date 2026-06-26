import {IActiveReservation, type IScreening} from "@/entities/screening";
import type {TReservationFormValues} from "@/features/create-reservation";

export interface ICreateReservationModalProps {
    activeReservation: IActiveReservation | null;
    cancelErrorMessage?: string;
    isCloseDisabled: boolean;
    isExpired: boolean;
    isOpen: boolean;
    isPaid: boolean;
    screening: IScreening | null;
    onClose: () => void | Promise<void>;
    onExpire: () => void;
    onSubmit: (
        values: TReservationFormValues,
    ) => Promise<void>;
}
