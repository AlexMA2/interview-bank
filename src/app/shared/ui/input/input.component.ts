/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, computed, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ValidationErrors } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-input',
    imports: [TranslateModule],
    templateUrl: './input.component.html',
    styleUrl: './input.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputComponent),
            multi: true,
        },
    ],
})
export class InputComponent implements ControlValueAccessor {
    /**
     * Label to be shown above the input
     */
    public readonly label = input<string | undefined>();
    /**
     * Placeholder to be shown when the input is empty
     */
    public readonly placeholder = input<string | undefined>();
    /**
     * Type of the input
     */
    public readonly type = input<string>('text');
    /**
     * Type of the input
     */
    public readonly sizing = input<'fixed' | 'dynamic'>('fixed');
    /**
     * Hint to be shown below the input
     */
    public readonly hint = input<string | undefined>();

    /**
     * The value of the input
     */
    protected value = signal('');
    /**
     * Whether the input is disabled
     */
    protected isDisabled = signal(false);
    /**
     * A unique identifier for the input
     */
    protected readonly customId = computed(() => crypto.randomUUID());

    protected isTouched = false;

    /**
     * function for ControlValueAccessor.
     */
    protected onChange: (value: any) => void = () => { };

    /**
     * function for ControlValueAccessor.
     */
    protected onTouched: () => void = () => { };

    public readonly hasError = input<boolean, ValidationErrors | null | undefined>(false, {
        transform: (value) => {
            if (value === null || value === undefined) return false
            const keys = Object.keys(value);
            if (keys.length === 0) return false
            if (keys.includes('required') && this.isTouched) return true
            const remainingKeys = keys.filter((key) => key !== 'required');
            return remainingKeys.length > 0
        },
    });

    /**
     * Writes a new value from the form model to the view.
     * @param value The new value from the form model.
     */
    writeValue(value: string): void {
        this.value.set(value);
    }
    /**
     * Registers a function to call when the value changes.
     * @param fn The function to register.
     */
    registerOnChange(fn: (value: string) => void): void {
        this.onChange = fn;
    }
    /**
     * Registers a function to call when the control is touched.
     * @param fn The function to register.
     */
    registerOnTouched(fn: () => void): void {

        this.onTouched = () => { this.isTouched = true; fn(); };
    }
    /**
     * Sets the disabled state of the control.
     * @param isDisabled Whether the control is disabled.
     */
    setDisabledState(isDisabled: boolean): void {
        this.isDisabled.set(isDisabled);
    }
    /**
     * Handles the input event from the input element.
     * @param event : any - DOM event
     */
    onInput(event: any): void {
        const target = event.target as HTMLInputElement;
        const value = target.value;
        this.value.set(value);
        this.onChange(value);
    }

    /**
     * Handles the blur event from the input element.
     * Calls the onTouched function to notify the form control.
     */
    onBlur(): void {
        this.onTouched();
    }
}
