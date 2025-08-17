import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error';

export interface Toast {
    id: number;
    type: ToastType;
    message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
    private _toasts = signal<Toast[]>([]);
    private counter = 0;

    public toasts = this._toasts.asReadonly();

    open(type: ToastType, message: string, duration = 3000) {
        const id = ++this.counter;
        const newToast: Toast = { id, type, message };
        this._toasts.update(list => [...list, newToast]);

        setTimeout(() => this.close(id), duration);
    }

    close(id: number) {
        this._toasts.update(list => list.filter(t => t.id !== id));
    }
}
