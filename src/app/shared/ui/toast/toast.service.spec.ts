import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
    let service: ToastService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ToastService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should open a toast', () => {
        service.open('success', 'Test message');
        const toasts = service.toasts();
        expect(toasts.length).toBe(1);
        expect(toasts[0].message).toBe('Test message');
        expect(toasts[0].type).toBe('success');
    });

    it('should close a toast manually', () => {
        service.open('error', 'Error message');
        const id = service.toasts()[0].id;

        service.close(id);
        expect(service.toasts().length).toBe(0);
    });

    it('should auto close after duration', (done) => {
        service.open('success', 'Auto close', 200);

        expect(service.toasts().length).toBe(1);

        setTimeout(() => {
            expect(service.toasts().length).toBe(0);
            done();
        }, 300);
    });
});
