export class MediaError extends Error {
    statusCode;
    message;
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.name = 'MediaError';
    }
}
export class UnauthorizedError extends MediaError {
    constructor(message = 'Unauthorized: Invalid API Key') {
        super(401, message);
        this.name = 'UnauthorizedError';
    }
}
export class ForbiddenError extends MediaError {
    constructor(message = 'Forbidden') {
        super(403, message);
        this.name = 'ForbiddenError';
    }
}
export class NotFoundError extends MediaError {
    constructor(message = 'Not Found') {
        super(404, message);
        this.name = 'NotFoundError';
    }
}
export class RateLimitError extends MediaError {
    constructor(message = 'Too Many Requests') {
        super(429, message);
        this.name = 'RateLimitError';
    }
}
export class InternalServerError extends MediaError {
    constructor(message = 'Internal Server Error') {
        super(500, message);
        this.name = 'InternalServerError';
    }
}
export class NetworkError extends MediaError {
    constructor(message = 'Network Error') {
        super(0, message);
        this.name = 'NetworkError';
    }
}
export const handleApiError = (status, statusText) => {
    switch (status) {
        case 401:
            throw new UnauthorizedError();
        case 403:
            throw new ForbiddenError();
        case 404:
            throw new NotFoundError();
        case 429:
            throw new RateLimitError();
        case 500:
            throw new InternalServerError();
        default:
            throw new MediaError(status, statusText);
    }
};
