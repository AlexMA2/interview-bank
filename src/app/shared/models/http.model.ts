export interface ApiResponse<T> {
    name?: string;
    message: string;
    data: T;
}
