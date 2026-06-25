export function getPublicApiUrl(): string {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
        throw new Error(
            'Не задана переменная окружения NEXT_PUBLIC_API_URL',
        );
    }

    return apiUrl.replace(/\/+$/, '');
}