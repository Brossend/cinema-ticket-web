'use client';

import {
    forwardRef,
    useId,
    type InputHTMLAttributes,
} from 'react';

import styles from './input.module.scss';

export interface IInputProps
    extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    errorMessage?: string;
}

export const Input = forwardRef<HTMLInputElement, IInputProps>(
    function Input(
        {
            'aria-describedby': ariaDescribedBy,
            className,
            errorMessage,
            id,
            label,
            required,
            ...inputProps
        },
        ref,
    ) {
        const generatedId = useId();
        const inputId = id ?? generatedId;
        const errorId = `${inputId}-error`;

        const describedBy = [
            ariaDescribedBy,
            errorMessage ? errorId : null,
        ]
            .filter(Boolean)
            .join(' ') || undefined;

        const inputClassName = [
            styles['input__control'],
            errorMessage && styles['input__control--error'],
            className,
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <div className={styles.input}>
                <label
                    className={styles['input__label']}
                    htmlFor={inputId}
                >
                    {label}

                    {required && (
                        <span
                            aria-hidden="true"
                            className={styles['input__required']}
                        >
                            *
                        </span>
                    )}
                </label>

                <input
                    {...inputProps}
                    aria-describedby={describedBy}
                    aria-invalid={Boolean(errorMessage)}
                    className={inputClassName}
                    id={inputId}
                    ref={ref}
                    required={required}
                />

                {errorMessage && (
                    <span
                        className={styles['input__error']}
                        id={errorId}
                        role="alert"
                    >
                        {errorMessage}
                    </span>
                )}
            </div>
        );
    },
);