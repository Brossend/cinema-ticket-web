import type { ReactNode } from 'react';

import { formatScreeningDate } from '../lib/format-screening-date';
import type { IScreening } from '../model/types';

import styles from './screening-card.module.scss';

interface IScreeningCardProps {
    screening: IScreening;
    actions?: ReactNode;
}

export function ScreeningCard({
                                  screening,
                                  actions,
                              }: IScreeningCardProps) {
    const isAvailable = screening.availableSeats > 0;

    const availabilityClassName = [
        styles['screening-card__meta-value'],
        !isAvailable &&
        styles['screening-card__meta-value--empty'],
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <article className={styles['screening-card']}>
            <div className={styles['screening-card__content']}>
                <p className={styles['screening-card__datetime']}>
                    {formatScreeningDate(screening.startsAt)}
                </p>

                <h2 className={styles['screening-card__title']}>
                    {screening.title}
                </h2>
            </div>

            <div className={styles['screening-card__aside']}>
                <dl className={styles['screening-card__meta']}>
                    <div className={styles['screening-card__meta-item']}>
                        <dt className={styles['screening-card__meta-label']}>
                            Всего мест
                        </dt>

                        <dd className={styles['screening-card__meta-value']}>
                            {screening.totalSeats}
                        </dd>
                    </div>

                    <div className={styles['screening-card__meta-item']}>
                        <dt className={styles['screening-card__meta-label']}>
                            Свободно
                        </dt>

                        <dd className={availabilityClassName}>
                            {isAvailable
                                ? screening.availableSeats
                                : 'Мест нет'}
                        </dd>
                    </div>
                </dl>

                {actions && (
                    <div className={styles['screening-card__actions']}>
                        {actions}
                    </div>
                )}
            </div>
        </article>
    );
}