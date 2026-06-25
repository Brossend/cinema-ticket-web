'use client';

import type { IScreening } from '@/entities/screening';
import { Button } from '@/shared/ui/button';

interface ICreateReservationButtonProps {
    isCreating: boolean;
    isDisabled: boolean;
    screening: IScreening;
    onStartReservation: (screening: IScreening) => void;
}

export function CreateReservationButton({
                                            isCreating,
                                            isDisabled,
                                            screening,
                                            onStartReservation,
                                        }: ICreateReservationButtonProps) {
    const isAvailable = screening.availableSeats > 0;

    function handleClick() {
        onStartReservation(screening);
    }

    return (
        <Button
            disabled={!isAvailable || isDisabled}
            isFullWidth
            onClick={handleClick}
        >
            {isCreating
                ? 'Бронируем...'
                : isAvailable
                    ? 'Оформить билет'
                    : 'Мест нет'}
        </Button>
    );
}