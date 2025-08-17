import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { ToastService } from './toast.service';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [NgClass],
    templateUrl: './toast.component.html',
    styleUrl: './toast.component.scss',
})
export class ToastComponent {
    private toastService = inject(ToastService);
    protected toasts = this.toastService.toasts;

    close(id: number) {
        this.toastService.close(id);
    }
}
