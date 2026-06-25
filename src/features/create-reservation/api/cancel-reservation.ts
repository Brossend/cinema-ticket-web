
import { httpClient } from '@/shared/api';
import {IActiveReservation, ICancelReservationResponse} from "@/entities/screening";

export function cancelReservation(
    reservation: IActiveReservation,
): Promise<ICancelReservationResponse> {
    return httpClient.delete<ICancelReservationResponse>(
        `/reservations/${reservation.id}`,
        {
            headers: {
                'X-Reservation-Token': reservation.token,
            },
        },
    );
}