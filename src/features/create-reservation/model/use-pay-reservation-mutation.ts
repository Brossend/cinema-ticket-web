'use client';

import {
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';

import { screeningQueryKeys } from '@/entities/screening';

import { payReservation } from '../api/pay-reservation';

export function usePayReservationMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: payReservation,

        async onSuccess() {
            await queryClient.invalidateQueries({
                queryKey: screeningQueryKeys.all,
            });
        },
    });
}