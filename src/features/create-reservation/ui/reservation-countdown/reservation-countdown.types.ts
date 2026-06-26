export interface IReservationCountdownProps {
    expiresAt: string;
    onExpire: () => void;
}