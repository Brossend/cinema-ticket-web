import styles from './button.module.scss';
import {IButtonProps} from "@/shared/ui/button/button.types";

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