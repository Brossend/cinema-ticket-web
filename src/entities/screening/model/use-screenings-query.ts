'use client';

import { useQuery } from '@tanstack/react-query';

import { getScreenings } from '../api/get-screenings';

import { screeningQueryKeys } from './query-keys';

const SCREENINGS_REFETCH_INTERVAL = 10_000;
const SCREENINGS_STALE_TIME = 5_000;

export function useScreeningsQuery() {
    return useQuery({
        queryKey: screeningQueryKeys.all,
        queryFn: getScreenings,
        refetchInterval: SCREENINGS_REFETCH_INTERVAL,
        staleTime: SCREENINGS_STALE_TIME,
    });
}