export interface IScreening {
    id: number;
    title: string;
    startsAt: string;
    totalSeats: number;
    availableSeats: number;
}

export interface ICreateReservationResponse {
    id: string;
    reservationToken: string;
    expiresAt: string;
}

export interface IPayReservationResponse {
    id: string;
    status: 'paid';
    paidAt: string;
}

export interface ICancelReservationResponse {
    id: string;
    status: 'cancelled';
}

export interface IActiveReservation {
    id: string;
    token: string;
    expiresAt: string;
    screeningId: number;
}