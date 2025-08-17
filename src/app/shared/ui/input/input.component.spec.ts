import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { InputComponent } from './input.component';

describe('InputComponent', () => {
    let fixture: ComponentFixture<InputComponent>;
    let component: InputComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [InputComponent, ReactiveFormsModule, FormsModule, TranslateModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(InputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have default values for inputs', () => {
        expect(component.label()).toBeUndefined();
        expect(component.placeholder()).toBeUndefined();
        expect(component.type()).toBe('text');
        expect(component.sizing()).toBe('fixed');
        expect(component.hint()).toBeUndefined();
        expect(component.hasError()).toBe(false);
    });

    it('should writeValue correctly', () => {
        component.writeValue('test');
        expect(component['value']()).toBe('test');
    });

    it('should registerOnChange and call onInput', () => {
        let changedValue = '';
        component.registerOnChange((val: string) => (changedValue = val));

        component.onInput({ target: { value: 'hello' } });
        expect(component['value']()).toBe('hello');
        expect(changedValue).toBe('hello');
    });

    it('should registerOnTouched and mark as touched', () => {
        let touched = false;
        component.registerOnTouched(() => (touched = true));

        component.onBlur();
        expect(component['isTouched']).toBe(true);
        expect(touched).toBeTrue();
    });

    it('should setDisabledState correctly', () => {
        component.setDisabledState(true);
        expect(component['isDisabled']()).toBe(true);

        component.setDisabledState(false);
        expect(component['isDisabled']()).toBe(false);
    });

    it('should compute hasError correctly', () => {
        const c = new InputComponent();

        // Touched = true, sin errores
        c['isTouched'] = true;
        expect(c.hasError()).toBe(false);

        // Touched = true, error required
        c['isTouched'] = true;
        const errorRequired: any = { required: true };
        (c.hasError as any).inputValue = errorRequired; // simulamos valor inicial
        expect(c.hasError()).toBe(true);

        // Otro error
        const errorMinlength: any = { minlength: true };
        (c.hasError as any).inputValue = errorMinlength;
        expect(c.hasError()).toBe(true);

        // required pero no touched
        c['isTouched'] = false;
        (c.hasError as any).inputValue = { required: true };
        expect(c.hasError()).toBe(false);
    });
});
