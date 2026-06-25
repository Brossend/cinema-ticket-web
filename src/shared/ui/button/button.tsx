import type { ButtonHTMLAttributes } from 'react';

import styles from './button.module.scss';

export type TButtonVariant = 'primary' | 'secondary';
export type TButtonSize = 'medium' | 'large';

export interface IButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: TButtonVariant;
    size?: TButtonSize;
    isFullWidth?: boolean;
}

export function Button({
                           className,
                           variant = 'primary',
                           size = 'medium',
                           isFullWidth = false,
                           type = 'button',
                           ...buttonProps
                       }: IButtonProps) {
    const buttonClassName = [
        styles.button,
        styles[`button--${variant}`],
        styles[`button--${size}`],
        isFullWidth && styles['button--full-width'],
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button
            className={buttonClassName}
            type={type}
            {...buttonProps}
        />
    );
}