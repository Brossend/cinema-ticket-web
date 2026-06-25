'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

import {
    reservationFormSchema,
    type TReservationFormValues,
} from '../model/reservation-form.schema';

import styles from './create-reservation-form.module.scss';

interface ICreateReservationFormProps {
    onSubmit: (
        values: TReservationFormValues,
    ) => Promise<void> | void;
}

export function CreateReservationForm({
                                          onSubmit,
                                      }: ICreateReservationFormProps) {
    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<TReservationFormValues>({
        defaultValues: {
            name: '',
            email: '',
        },
        mode: 'onBlur',
        resolver: zodResolver(reservationFormSchema),
    });

    async function handleFormSubmit(
        values: TReservationFormValues,
    ) {
        await onSubmit(values);
    }

    return (
        <form
            className={styles['create-reservation-form']}
            noValidate
            onSubmit={handleSubmit(handleFormSubmit)}
        >
            <div
                className={
                    styles['create-reservation-form__fields']
                }
            >
                <Input
                    autoComplete="name"
                    errorMessage={errors.name?.message}
                    label="Имя"
                    placeholder="Иван Иванов"
                    required
                    {...register('name')}
                />

                <Input
                    autoComplete="email"
                    errorMessage={errors.email?.message}
                    inputMode="email"
                    label="Email"
                    placeholder="ivan@example.com"
                    required
                    type="email"
                    {...register('email')}
                />
            </div>

            <Button
                isFullWidth
                disabled={isSubmitting}
                size="large"
                type="submit"
            >
                {isSubmitting ? 'Обрабатываем...' : 'Оплатить'}
            </Button>
        </form>
    );
}