import type {TReservationFormValues} from "@/features/create-reservation";

export interface ICreateReservationFormProps {
    onSubmit: (
        values: TReservationFormValues,
    ) => Promise<void>;
}