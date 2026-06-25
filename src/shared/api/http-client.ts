import { getPublicApiUrl } from '@/shared/config';

import {
    ApiError,
    type TApiValidationErrors,
} from './api-error';

type THttpMethod = 'DELETE' | 'GET' | 'PATCH' | 'POST';

interface IHttpRequestOptions
    extends Omit<RequestInit, 'body' | 'method'> {
    body?: unknown;
    method?: THttpMethod;
}

interface IApiErrorResponse {
    message?: string;
    errors?: TApiValidationErrors;
}

function buildUrl(path: string): string {
    const apiUrl = getPublicApiUrl();
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    return `${apiUrl}${normalizedPath}`;
}

function isApiErrorResponse(
    value: unknown,
): value is IApiErrorResponse {
    return typeof value === 'object' && value !== null;
}

async function parseResponseBody(
    response: Response,
): Promise<unknown> {
    if (response.status === 204) {
        return null;
    }

    const contentType = response.headers.get('content-type') ?? '';

    if (contentType.includes('application/json')) {
        return response.json();
    }

    return response.text();
}

async function request<TResponse>(
    path: string,
    options: IHttpRequestOptions = {},
): Promise<TResponse> {
    const {
        body,
        headers: requestHeaders,
        ...requestOptions
    } = options;

    const headers = new Headers(requestHeaders);

    headers.set('Accept', 'application/json');

    if (body !== undefined) {
        headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(buildUrl(path), {
        ...requestOptions,
        body: body === undefined ? undefined : JSON.stringify(body),
        headers,
    });

    const responseBody = await parseResponseBody(response);

    if (!response.ok) {
        const errorResponse = isApiErrorResponse(responseBody)
            ? responseBody
            : null;

        throw new ApiError({
            message:
                errorResponse?.message ??
                'Не удалось выполнить запрос',
            status: response.status,
            validationErrors: errorResponse?.errors,
        });
    }

    return responseBody as TResponse;
}

export const httpClient = {
    get<TResponse>(
        path: string,
        options?: Omit<IHttpRequestOptions, 'body' | 'method'>,
    ): Promise<TResponse> {
        return request<TResponse>(path, {
            ...options,
            cache: options?.cache ?? 'no-store',
            method: 'GET',
        });
    },

    post<TResponse, TBody>(
        path: string,
        body: TBody,
        options?: Omit<IHttpRequestOptions, 'body' | 'method'>,
    ): Promise<TResponse> {
        return request<TResponse>(path, {
            ...options,
            body,
            method: 'POST',
        });
    },
};