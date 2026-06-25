import { ScreeningsList } from '@/widgets/screenings-list';

import styles from './screenings-page.module.scss';

export function ScreeningsPage() {
    return (
        <main className={styles['screenings-page']}>
            <section className={styles['screenings-page__content']}>
                <div className={styles['screenings-page__heading']}>
                    <p className={styles['screenings-page__eyebrow']}>
                        Cinema Tickets
                    </p>

                    <h1 className={styles['screenings-page__title']}>
                        Киносеансы
                    </h1>

                    <p className={styles['screenings-page__description']}>
                        Выберите сеанс, чтобы временно забронировать место.
                    </p>
                </div>

                <ScreeningsList />
            </section>
        </main>
    );
}