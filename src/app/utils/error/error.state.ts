import { HttpErrorResponse } from '@angular/common/http';

export interface ErrorState {
    status?: number;
    message?: string;
    error: any;
    target: string;
}
export const errorStateMapper = (error: HttpErrorResponse, target: string): ErrorState => ({
    status: error.status,
    message: error.message,
    error: error.error,
    target
});
