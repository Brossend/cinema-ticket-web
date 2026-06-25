export type TApiValidationErrors = Record<string, string[]>;

interface IApiErrorParams {
    message: string;
    status: number;
    validationErrors?: TApiValidationErrors;
}

export class ApiError extends Error {
    public readonly status: number;

    public readonly validationErrors?: TApiValidationErrors;

    constructor({
                    message,
                    status,
                    validationErrors,
                }: IApiErrorParams) {
        super(message);

        this.name = 'ApiError';
        this.status = status;
        this.validationErrors = validationErrors;
    }
}

export function isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError;
}