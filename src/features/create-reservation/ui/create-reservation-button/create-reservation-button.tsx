'use client';

import { Button } from '@/shared/ui/button';
import {
    ICreateReservationButtonProps
} from "@/features/create-reservation/ui/create-reservation-button/create-reservation-button.types";

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