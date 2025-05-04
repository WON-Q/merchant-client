export interface HookResponse<T> {
    success: boolean;
    data?: T;
    errorMessage?: string | null;
}