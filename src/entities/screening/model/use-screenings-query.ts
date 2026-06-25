'use client';

import { useQuery } from '@tanstack/react-query';

import { getScreenings } from '../api/get-screenings';

import { screeningQueryKeys } from './query-keys';

export function useScreeningsQuery() {
    return useQuery({
        queryKey: screeningQueryKeys.all,
        queryFn: getScreenings,
        refetchInterval: 10_000,
    });
}