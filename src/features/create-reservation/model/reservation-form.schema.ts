import { z } from 'zod';

export const reservationFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, 'Введите имя минимум из 2 символов')
        .max(80, 'Имя не должно быть длиннее 80 символов'),

    email: z
        .string()
        .trim()
        .email('Введите корректный email')
        .max(254, 'Email слишком длинный'),
});

export type TReservationFormValues = z.infer<
    typeof reservationFormSchema
>;