'use client';

import type {
    ReactNode,
    SyntheticEvent,
} from 'react';
import {
    useEffect,
    useId,
    useRef,
} from 'react';

import styles from './modal.module.scss';

interface IModalProps {
    children: ReactNode;
    isOpen: boolean;
    title: string;
    onClose: () => void;
}

export function Modal({
                          children,
                          isOpen,
                          title,
                          onClose,
                      }: IModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const titleId = useId();

    useEffect(() => {
        const dialog = dialogRef.current;

        if (!dialog) {
            return;
        }

        if (isOpen) {
            if (!dialog.open) {
                dialog.showModal();
            }

            return;
        }

        if (dialog.open) {
            dialog.close();
        }
    }, [isOpen]);

    function handleCancel(
        event: SyntheticEvent<HTMLDialogElement>,
    ) {
        event.preventDefault();
        onClose();
    }

    return (
        <dialog
            aria-labelledby={titleId}
            className={styles.modal}
            onCancel={handleCancel}
            ref={dialogRef}
        >
            <div className={styles['modal__content']}>
                <header className={styles['modal__header']}>
                    <h2
                        className={styles['modal__title']}
                        id={titleId}
                    >
                        {title}
                    </h2>

                    <button
                        aria-label="Закрыть модальное окно"
                        className={styles['modal__close']}
                        onClick={onClose}
                        type="button"
                    >
                        <span aria-hidden="true">×</span>
                    </button>
                </header>

                <div className={styles['modal__body']}>
                    {children}
                </div>
            </div>
        </dialog>
    );
}