export class ErrorResponse {
    message: string;
    error?: any;

    constructor(message: string, error?: any) {
        this.message = message;
        this.error = error;
    }
}

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};
