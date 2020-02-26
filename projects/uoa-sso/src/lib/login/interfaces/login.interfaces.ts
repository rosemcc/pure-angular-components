export interface Callback {
    callback(): void;
    callbackWithParam(result: any): void;
}
