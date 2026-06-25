import {
    formatScreeningDate,
    type IScreening,
} from '@/entities/screening';
import { Modal } from '@/shared/ui/modal';

import {
    type TReservationFormValues,
} from '../model/reservation-form.schema';
import { CreateReservationForm } from './create-reservation-form';

import styles from './create-reservation-modal.module.scss';

interface ICreateReservationModalProps {
    screening: IScreening | null;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (
        values: TReservationFormValues,
    ) => Promise<void> | void;
}

export function CreateReservationModal({
                                           screening,
                                           isOpen,
                                           onClose,
                                           onSubmit,
                                       }: ICreateReservationModalProps) {
    if (!screening) {
        return null;
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Оформление билета"
        >
            <div className={styles['create-reservation-modal']}>
                <div>
                    <div
                        className={
                            styles[
                                'create-reservation-modal__screening'
                                ]
                        }
                    >
                        <p
                            className={
                                styles[
                                    'create-reservation-modal__datetime'
                                    ]
                            }
                        >
                            {formatScreeningDate(screening.startsAt)}
                        </p>

                        <h3
                            className={
                                styles[
                                    'create-reservation-modal__title'
                                    ]
                            }
                        >
                            {screening.title}
                        </h3>
                    </div>
                </div>

                <CreateReservationForm onSubmit={onSubmit} />
            </div>
        </Modal>
    );
}