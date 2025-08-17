/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePickerComponent } from './date-picker.component';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

describe('DatePickerComponent', () => {
    let component: DatePickerComponent;
    let fixture: ComponentFixture<DatePickerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, DatePickerComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DatePickerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should write value to input', () => {
        const date = new Date('2025-08-16T00:00:00');
        component.writeValue(date);
        fixture.detectChanges();
        const input = fixture.debugElement.query(By.css('input[type="text"]')).nativeElement;
        expect(input.value).toBe('16/08/2025');
    });

    it('should register onChange', () => {
        const spy = jasmine.createSpy();
        component.registerOnChange(spy);
        component.onDateChange({ target: { value: '2025-08-17' } } as any);
        expect(spy).toHaveBeenCalledWith(new Date('2025-08-17T00:00:00'));
    });

    it('should register onTouched', () => {
        const spy = jasmine.createSpy();
        component.registerOnTouched(spy);
        component.onDateChange({ target: { value: '2025-08-18' } } as any);
        expect(spy).toHaveBeenCalled();
    });

    it('should emit dateSelected on date change', () => {
        spyOn(component.dateSelected, 'emit');
        component.onDateChange({ target: { value: '2025-08-19' } } as any);
        expect(component.dateSelected.emit).toHaveBeenCalledWith(new Date('2025-08-19T00:00:00'));
    });
});
