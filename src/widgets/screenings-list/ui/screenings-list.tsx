'use client';

import { useState } from 'react';

import {
    ScreeningCard,
    type IScreening,
} from '@/entities/screening';
import {
    CreateReservationButton,
    CreateReservationModal,
    type TReservationFormValues,
} from '@/features/create-reservation';

import styles from './screenings-list.module.scss';

interface IScreeningsListProps {
    screenings: IScreening[];
}

export function ScreeningsList({
                                   screenings,
                               }: IScreeningsListProps) {
    const [selectedScreening, setSelectedScreening] =
        useState<IScreening | null>(null);

    function handleStartReservation(screening: IScreening) {
        setSelectedScreening(screening);
    }

    function handleCloseReservationModal() {
        setSelectedScreening(null);
    }

    async function handleReservationSubmit(
        values: TReservationFormValues,
    ) {
        if (!selectedScreening) {
            return;
        }

        console.log('Reservation payload', {
            screeningId: selectedScreening.id,
            ...values,
        });
    }

    return (
        <>
            <ul className={styles['screenings-list']}>
                {screenings.map((screening) => (
                    <li
                        className={styles['screenings-list__item']}
                        key={screening.id}
                    >
                        <ScreeningCard
                            actions={
                                <CreateReservationButton
                                    onStartReservation={
                                        handleStartReservation
                                    }
                                    screening={screening}
                                />
                            }
                            screening={screening}
                        />
                    </li>
                ))}
            </ul>

            <CreateReservationModal
                isOpen={selectedScreening !== null}
                onClose={handleCloseReservationModal}
                onSubmit={handleReservationSubmit}
                screening={selectedScreening}
            />
        </>
    );
}