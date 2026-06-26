'use client';

import {
    useEffect,
    useRef,
} from 'react';

import { useReservationCountdown } from '../../model/use-reservation-countdown';

import styles from './reservation-countdown.module.scss';
import {
    IReservationCountdownProps
} from "@/features/create-reservation/ui/reservation-countdown/reservation-countdown.types";

function formatRemainingTime(remainingSeconds: number): string {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(
        seconds,
    ).padStart(2, '0')}`;
}

export function ReservationCountdown({
                                         expiresAt,
                                         onExpire,
                                     }: IReservationCountdownProps) {
    const {
        isExpired,
        remainingSeconds,
    } = useReservationCountdown(expiresAt);

    const hasNotifiedExpirationRef = useRef(false);

    useEffect(() => {
        hasNotifiedExpirationRef.current = false;
    }, [expiresAt]);

    useEffect(() => {
        if (!isExpired || hasNotifiedExpirationRef.current) {
            return;
        }

        hasNotifiedExpirationRef.current = true;
        onExpire();
    }, [isExpired, onExpire]);

    return (
        <div className={styles['reservation-countdown']}>
            <span
                className={
                    styles['reservation-countdown__label']
                }
            >
                Бронь действует ещё
            </span>

            <output
                className={
                    styles['reservation-countdown__value']
                }
                role="timer"
            >
                {formatRemainingTime(remainingSeconds)}
            </output>
        </div>
    );
}