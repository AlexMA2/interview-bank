import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ToastComponent } from './toast.component';
import { ToastService } from './toast.service';

describe('ToastComponent', () => {
    let fixture: ComponentFixture<ToastComponent>;
    let component: ToastComponent;
    let service: ToastService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ToastComponent],
            providers: [ToastService]
        }).compileComponents();

        fixture = TestBed.createComponent(ToastComponent);
        component = fixture.componentInstance;
        service = TestBed.inject(ToastService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render a success toast', () => {
        service.open('success', 'Success message');
        fixture.detectChanges();

        const toastEl = fixture.debugElement.query(By.css('.toast.success'));
        expect(toastEl).toBeTruthy();
        expect(toastEl.nativeElement.textContent).toContain('Success message');
    });

    it('should render an error toast', () => {
        service.open('error', 'Error message');
        fixture.detectChanges();

        const toastEl = fixture.debugElement.query(By.css('.toast.error'));
        expect(toastEl).toBeTruthy();
        expect(toastEl.nativeElement.textContent).toContain('Error message');
    });

    it('should remove toast when close button is clicked', () => {
        service.open('success', 'Closable toast');
        fixture.detectChanges();

        const closeBtn = fixture.debugElement.query(By.css('.close-btn'));
        closeBtn.nativeElement.click();
        fixture.detectChanges();

        expect(service.toasts().length).toBe(0);
    });
});
