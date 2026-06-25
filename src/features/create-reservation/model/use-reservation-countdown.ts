'use client';

import {
    useEffect,
    useState,
} from 'react';

function getRemainingSeconds(expiresAt: string): number {
    const expiresAtTimestamp = new Date(expiresAt).getTime();
    const remainingMilliseconds = expiresAtTimestamp - Date.now();

    return Math.max(
        0,
        Math.ceil(remainingMilliseconds / 1000),
    );
}

export function useReservationCountdown(expiresAt: string) {
    const [remainingSeconds, setRemainingSeconds] = useState(
        () => getRemainingSeconds(expiresAt),
    );

    useEffect(() => {
        function updateRemainingSeconds() {
            setRemainingSeconds(getRemainingSeconds(expiresAt));
        }

        updateRemainingSeconds();

        const intervalId = window.setInterval(
            updateRemainingSeconds,
            1_000,
        );

        return () => {
            window.clearInterval(intervalId);
        };
    }, [expiresAt]);

    return {
        isExpired: remainingSeconds === 0,
        remainingSeconds,
    };
}