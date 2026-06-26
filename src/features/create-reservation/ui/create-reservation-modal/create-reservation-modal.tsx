
import {
    formatScreeningDate, IActiveReservation,
    type IScreening,
} from '@/entities/screening';
import { Button } from '@/shared/ui/button';
import { Modal } from '@/shared/ui/modal';

import type { TReservationFormValues } from '@/features/create-reservation';
import { CreateReservationForm } from '../create-reservation-form/create-reservation-form';
import { ReservationCountdown } from '../reservation-countdown/reservation-countdown';

import styles from './create-reservation-modal.module.scss';
import {
    ICreateReservationModalProps
} from "@/features/create-reservation/ui/create-reservation-modal/create-reservation-modal.types";

export function CreateReservationModal({
                                           activeReservation,
                                           cancelErrorMessage,
                                           isCloseDisabled,
                                           isExpired,
                                           isOpen,
                                           isPaid,
                                           screening,
                                           onClose,
                                           onExpire,
                                           onSubmit,
                                       }: ICreateReservationModalProps) {
    if (!screening || !activeReservation) {
        return null;
    }

    return (
        <Modal
            isCloseDisabled={isCloseDisabled}
            isOpen={isOpen}
            onClose={onClose}
            title="Оформление билета"
        >
            <div className={styles['create-reservation-modal']}>
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

                {!isPaid && !isExpired && (
                    <>
                        <ReservationCountdown
                            expiresAt={activeReservation.expiresAt}
                            onExpire={onExpire}
                        />

                        {cancelErrorMessage && (
                            <p
                                className={
                                    styles[
                                        'create-reservation-modal__error'
                                        ]
                                }
                                role="alert"
                            >
                                {cancelErrorMessage}
                            </p>
                        )}

                        <CreateReservationForm
                            onSubmit={onSubmit}
                        />
                    </>
                )}

                {isPaid && (
                    <div
                        className={
                            styles[
                                'create-reservation-modal__state'
                                ]
                        }
                    >
                        <p
                            className={
                                styles[
                                    'create-reservation-modal__state-title'
                                    ]
                            }
                        >
                            Оплата прошла успешно
                        </p>

                        <p
                            className={
                                styles[
                                    'create-reservation-modal__state-description'
                                    ]
                            }
                        >
                            Билет на выбранный сеанс оформлен.
                        </p>

                        <Button
                            isFullWidth
                            onClick={() => {
                                void onClose();
                            }}
                            size="large"
                        >
                            Готово
                        </Button>
                    </div>
                )}

                {isExpired && (
                    <div
                        className={
                            styles[
                                'create-reservation-modal__state'
                                ]
                        }
                    >
                        <p
                            className={
                                styles[
                                    'create-reservation-modal__state-title'
                                    ]
                            }
                        >
                            Время бронирования истекло
                        </p>

                        <p
                            className={
                                styles[
                                    'create-reservation-modal__state-description'
                                    ]
                            }
                        >
                            Место снова доступно для других покупателей.
                        </p>

                        <Button
                            isFullWidth
                            onClick={() => {
                                void onClose();
                            }}
                            size="large"
                            variant="secondary"
                        >
                            Закрыть
                        </Button>
                    </div>
                )}
            </div>
        </Modal>
    );
}