export declare class MediaError extends Error {
    statusCode: number;
    message: string;
    constructor(statusCode: number, message: string);
}
export declare class UnauthorizedError extends MediaError {
    constructor(message?: string);
}
export declare class ForbiddenError extends MediaError {
    constructor(message?: string);
}
export declare class NotFoundError extends MediaError {
    constructor(message?: string);
}
export declare class RateLimitError extends MediaError {
    constructor(message?: string);
}
export declare class InternalServerError extends MediaError {
    constructor(message?: string);
}
export declare class NetworkError extends MediaError {
    constructor(message?: string);
}
export declare const handleApiError: (status: number, statusText: string) => never;
