import { httpClient } from '@/shared/api';

import type { IScreening } from '../model/types';

export function getScreenings(): Promise<IScreening[]> {
    return httpClient.get<IScreening[]>('/screenings');
}