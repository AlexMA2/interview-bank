/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { KeyValuePipe } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
    selector: 'app-input',
    imports: [KeyValuePipe],
    templateUrl: './input.component.html',
    styleUrl: './input.component.scss',
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
     * Hint to be shown below the input
     */
    public readonly hint = input<string | undefined>();
    /**
     * A record of validation errors where the key is the error code
     * and the value is the corresponding message.
     * Example: { 'required': 'Date is required.' }
     */
    public readonly errorMessages = input<Record<string, string> | undefined>(
        undefined
    );
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
    /**
     * function for ControlValueAccessor.
     */
    protected onChange: (value: any) => void = () => {};

    /**
     * function for ControlValueAccessor.
     */
    protected onTouched: () => void = () => {};
    /**
     * The ngControl for the input. Used to register the value accessor.
     */
    public ngControl = inject(NgControl, { optional: true, self: true });
    /**
     * The errors of the input
     */
    public get errors() {
        return this.ngControl?.control?.errors;
    }

    constructor() {
        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }
    }
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
        this.onTouched = fn;
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
