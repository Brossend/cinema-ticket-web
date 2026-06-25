'use client';

import {
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';

import { screeningQueryKeys } from '@/entities/screening';

import { createReservation } from '../api/create-reservation';

export function useCreateReservationMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createReservation,

        async onSuccess() {
            await queryClient.invalidateQueries({
                queryKey: screeningQueryKeys.all,
            });
        },
    });
}