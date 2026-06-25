import type { IScreening } from '@/entities/screening';
import { Button } from '@/shared/ui/button';

interface ICreateReservationButtonProps {
    screening: IScreening;
    onStartReservation: (screening: IScreening) => void;
}

export function CreateReservationButton({
                                            screening,
                                            onStartReservation,
                                        }: ICreateReservationButtonProps) {
    const isAvailable = screening.availableSeats > 0;

    function handleClick() {
        onStartReservation(screening);
    }

    return (
        <Button
            disabled={!isAvailable}
            isFullWidth
            onClick={handleClick}
        >
            {isAvailable ? 'Оформить билет' : 'Мест нет'}
        </Button>
    );
}