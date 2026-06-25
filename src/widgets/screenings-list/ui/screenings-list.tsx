'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import {
    screeningQueryKeys,
    ScreeningCard,
    type IScreening,
    useScreeningsQuery, IActiveReservation,
} from '@/entities/screening';
import {
    CreateReservationButton,
    CreateReservationModal,
    type TReservationFormValues,
    useCancelReservationMutation,
    useCreateReservationMutation,
    usePayReservationMutation,
} from '@/features/create-reservation';
import { isApiError } from '@/shared/api';
import { Button } from '@/shared/ui/button';

import styles from './screenings-list.module.scss';

function getErrorMessage(
    error: unknown,
    fallbackMessage: string,
): string {
    return isApiError(error)
        ? error.message
        : fallbackMessage;
}

export function ScreeningsList() {
    const queryClient = useQueryClient();

    const {
        data: screenings = [],
        error: screeningsError,
        isError: isScreeningsError,
        isPending: isScreeningsPending,
        refetch,
    } = useScreeningsQuery();

    const createReservationMutation =
        useCreateReservationMutation();

    const payReservationMutation =
        usePayReservationMutation();

    const cancelReservationMutation =
        useCancelReservationMutation();

    const [activeReservation, setActiveReservation] =
        useState<IActiveReservation | null>(null);

    const [selectedScreening, setSelectedScreening] =
        useState<IScreening | null>(null);

    const [isPaid, setIsPaid] = useState(false);

    const [isExpired, setIsExpired] = useState(false);

    const [createErrorMessage, setCreateErrorMessage] =
        useState<string | null>(null);

    const [cancelErrorMessage, setCancelErrorMessage] =
        useState<string | null>(null);

    function clearReservationSession() {
        setActiveReservation(null);
        setSelectedScreening(null);
        setIsPaid(false);
        setIsExpired(false);
        setCancelErrorMessage(null);
    }

    async function handleStartReservation(
        screening: IScreening,
    ) {
        setCreateErrorMessage(null);

        try {
            const reservation =
                await createReservationMutation.mutateAsync(
                    screening.id,
                );

            setSelectedScreening(screening);

            setActiveReservation({
                expiresAt: reservation.expiresAt,
                id: reservation.id,
                screeningId: screening.id,
                token: reservation.reservationToken,
            });

            setIsPaid(false);
            setIsExpired(false);
        } catch (error) {
            setCreateErrorMessage(
                getErrorMessage(
                    error,
                    'Не удалось создать временную бронь.',
                ),
            );
        }
    }

    async function handleReservationSubmit(
        values: TReservationFormValues,
    ): Promise<void> {
        if (!activeReservation || isExpired) {
            return;
        }

        try {
            await payReservationMutation.mutateAsync({
                reservation: activeReservation,
                values,
            });

            setIsPaid(true);
        } catch (error) {
            if (
                isApiError(error) &&
                error.status === 409
            ) {
                setIsExpired(true);

                void queryClient.invalidateQueries({
                    queryKey: screeningQueryKeys.all,
                });
            }

            throw error;
        }
    }

    async function handleCloseReservationModal() {
        if (!activeReservation) {
            clearReservationSession();

            return;
        }

        if (isPaid || isExpired) {
            clearReservationSession();

            return;
        }

        if (
            cancelReservationMutation.isPending ||
            payReservationMutation.isPending
        ) {
            return;
        }

        setCancelErrorMessage(null);

        try {
            await cancelReservationMutation.mutateAsync(
                activeReservation,
            );

            clearReservationSession();
        } catch (error) {
            if (
                isApiError(error) &&
                (error.status === 404 || error.status === 409)
            ) {
                clearReservationSession();

                void queryClient.invalidateQueries({
                    queryKey: screeningQueryKeys.all,
                });

                return;
            }

            setCancelErrorMessage(
                getErrorMessage(
                    error,
                    'Не удалось отменить бронь. Повторите попытку.',
                ),
            );
        }
    }

    function handleReservationExpire() {
        if (isPaid || isExpired) {
            return;
        }

        setIsExpired(true);

        void queryClient.invalidateQueries({
            queryKey: screeningQueryKeys.all,
        });
    }

    if (isScreeningsPending) {
        return (
            <section
                aria-label="Список киносеансов"
                className={styles['screenings-list']}
            >
                <div
                    aria-live="polite"
                    className={styles['screenings-list__state']}
                    role="status"
                >
                    Загружаем киносеансы...
                </div>
            </section>
        );
    }

    if (isScreeningsError) {
        const errorMessage = getErrorMessage(
            screeningsError,
            'Не удалось загрузить киносеансы.',
        );

        return (
            <section
                aria-label="Список киносеансов"
                className={styles['screenings-list']}
            >
                <div
                    className={styles['screenings-list__state']}
                    role="alert"
                >
                    <p>{errorMessage}</p>

                    <Button
                        onClick={() => {
                            void refetch();
                        }}
                        variant="secondary"
                    >
                        Повторить
                    </Button>
                </div>
            </section>
        );
    }

    if (screenings.length === 0) {
        return (
            <section
                aria-label="Список киносеансов"
                className={styles['screenings-list']}
            >
                <div className={styles['screenings-list__state']}>
                    Сейчас нет доступных киносеансов.
                </div>
            </section>
        );
    }

    const isModalOpen =
        activeReservation !== null &&
        selectedScreening !== null;

    const isCloseDisabled =
        payReservationMutation.isPending ||
        cancelReservationMutation.isPending;

    return (
        <>
            <section
                aria-label="Список киносеансов"
                className={styles['screenings-list']}
            >
                {createErrorMessage && (
                    <p
                        className={styles['screenings-list__error']}
                        role="alert"
                    >
                        {createErrorMessage}
                    </p>
                )}

                <ul
                    className={
                        styles['screenings-list__content']
                    }
                >
                    {screenings.map((screening) => (
                        <li
                            className={
                                styles['screenings-list__item']
                            }
                            key={screening.id}
                        >
                            <ScreeningCard
                                actions={
                                    <CreateReservationButton
                                        isCreating={
                                            createReservationMutation.isPending &&
                                            createReservationMutation.variables ===
                                            screening.id
                                        }
                                        isDisabled={
                                            createReservationMutation.isPending
                                        }
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
            </section>

            <CreateReservationModal
                activeReservation={activeReservation}
                cancelErrorMessage={cancelErrorMessage ?? undefined}
                isCloseDisabled={isCloseDisabled}
                isExpired={isExpired}
                isOpen={isModalOpen}
                isPaid={isPaid}
                onClose={handleCloseReservationModal}
                onExpire={handleReservationExpire}
                onSubmit={handleReservationSubmit}
                screening={selectedScreening}
            />
        </>
    );
}