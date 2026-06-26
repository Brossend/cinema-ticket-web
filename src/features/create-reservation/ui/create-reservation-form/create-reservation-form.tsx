'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { isApiError } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

import {
    reservationFormSchema,
    type TReservationFormValues,
} from '../../model/reservation-form.schema';

import styles from './create-reservation-form.module.scss';
import {
    ICreateReservationFormProps
} from "@/features/create-reservation/ui/create-reservation-form/create-reservation-form.types";

export function CreateReservationForm({
                                          onSubmit,
                                      }: ICreateReservationFormProps) {
    const {
        clearErrors,
        formState: {
            errors,
            isSubmitting,
        },
        handleSubmit,
        register,
        setError,
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
        clearErrors();

        try {
            await onSubmit(values);
        } catch (error) {
            if (isApiError(error)) {
                const nameError =
                    error.validationErrors?.name?.[0];

                const emailError =
                    error.validationErrors?.email?.[0];

                if (nameError) {
                    setError('name', {
                        message: nameError,
                        type: 'server',
                    });
                }

                if (emailError) {
                    setError('email', {
                        message: emailError,
                        type: 'server',
                    });
                }

                if (!nameError && !emailError) {
                    setError('root', {
                        message: error.message,
                        type: 'server',
                    });
                }

                return;
            }

            setError('root', {
                message:
                    'Не удалось выполнить оплату. Повторите попытку.',
                type: 'server',
            });
        }
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

            {errors.root?.message && (
                <p
                    className={
                        styles['create-reservation-form__error']
                    }
                    role="alert"
                >
                    {errors.root.message}
                </p>
            )}

            <Button
                disabled={isSubmitting}
                isFullWidth
                size="large"
                type="submit"
            >
                {isSubmitting ? 'Оплата...' : 'Оплатить'}
            </Button>
        </form>
    );
}