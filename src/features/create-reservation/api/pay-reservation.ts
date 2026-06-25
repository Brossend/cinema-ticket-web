
import { httpClient } from '@/shared/api';

import type { TReservationFormValues } from '@/features/create-reservation';
import {IActiveReservation, IPayReservationResponse} from "@/entities/screening";

interface IPayReservationParams {
    reservation: IActiveReservation;
    values: TReservationFormValues;
}

export function payReservation({
                                   reservation,
                                   values,
                               }: IPayReservationParams): Promise<IPayReservationResponse> {
    return httpClient.post<
        IPayReservationResponse,
        TReservationFormValues
    >(
        `/reservations/${reservation.id}/pay`,
        values,
        {
            headers: {
                'X-Reservation-Token': reservation.token,
            },
        },
    );
}