'use client';

import {
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';

import { screeningQueryKeys } from '@/entities/screening';

import { cancelReservation } from '../api/cancel-reservation';

export function useCancelReservationMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cancelReservation,

        async onSuccess() {
            await queryClient.invalidateQueries({
                queryKey: screeningQueryKeys.all,
            });
        },
    });
}