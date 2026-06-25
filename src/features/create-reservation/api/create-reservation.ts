
import { httpClient } from '@/shared/api';
import {ICreateReservationResponse} from "@/entities/screening";

export function createReservation(
    screeningId: number,
): Promise<ICreateReservationResponse> {
    return httpClient.post<ICreateReservationResponse>(
        `/screenings/${screeningId}/reservations`,
    );
}