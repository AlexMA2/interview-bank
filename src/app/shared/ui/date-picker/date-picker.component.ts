/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, forwardRef, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    ControlValueAccessor,
    NG_VALUE_ACCESSOR,
    FormControl,
    FormGroupDirective,
} from '@angular/forms';
import { input } from '@angular/core';

/**
 * @description
 * Enumeration of supported date formats.
 */
export enum DateFormat {
    /** YYYY-MM-DD format, e.g., 2025-08-16 */
    YYYY_MM_DD = 'YYYY-MM-DD',
    /** MM/DD/YYYY format, e.g., 08/16/2025 */
    MM_DD_YYYY = 'MM/DD/YYYY',
    /** DD/MM/YYYY format, e.g., 16/08/2025 */
    DD_MM_YYYY = 'DD/MM/YYYY',
}

@Component({
    selector: 'app-date-picker',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './date-picker.component.html',
    styleUrl: './date-picker.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DatePickerComponent),
            multi: true,
        },
    ],
})
export class DatePickerComponent implements ControlValueAccessor, OnInit {
    public readonly label = input<string | undefined>();
    /**
     * The name of the form control bound to this component.
     * Required for error message validation.
     */
    public formControlName = input.required<string>();

    /**
     * The date format to display in the input. Defaults to YYYY-MM-DD.
     */
    public format = input<DateFormat>(DateFormat.YYYY_MM_DD);

    /**
     * A record of validation errors where the key is the error code
     * and the value is the corresponding message.
     * Example: { 'required': 'Date is required.' }
     */
    public errors = input<Record<string, string>>({});

    /**
     * The reactive form control associated with this component.
     * Injected from the parent component's FormGroupDirective.
     */
    public control!: FormControl;

    /**
     * The current date value of the component.
     */
    protected date = new FormControl<string | null>(null);

    /**
     * A computed signal that returns the active error messages based on the
     * control's validation state and the provided `errors` input.
     */
    public activeErrors = computed(() => {
        const activeErrors: Record<string, string> = {};
        if (this.control?.touched && this.control?.errors) {
            for (const errorKey of Object.keys(this.errors())) {
                if (this.control.errors[errorKey]) {
                    activeErrors[errorKey] = this.errors()[errorKey];
                }
            }
        }
        return activeErrors;
    });

    /**
     * function for ControlValueAccessor.
     */
    protected onChange: (value: any) => void = () => {};

    /**
     * function for ControlValueAccessor.
     */
    protected onTouched: () => void = () => {};
    /**
     * A unique identifier for the input
     */
    protected readonly customId = computed(() => crypto.randomUUID());
    /**
     * Initializes the component.
     * Retrieves the form control from the parent form group directive.
     */
    ngOnInit(): void {
        const formGroupDirective = inject(FormGroupDirective);
        const control = formGroupDirective.form.get(this.formControlName());
        if (control instanceof FormControl) {
            this.control = control;
        } else {
            throw new Error(
                `[DatePickerComponent]: No valid FormControl found for name "${this.formControlName()}".`
            );
        }
    }
    /**
     * Writes a new value from the form model to the view.
     * @param value The new value from the form model.
     */
    public writeValue(value: any): void {
        if (value instanceof Date) {
            this.date.setValue(this.formatDate(value));
        } else if (typeof value === 'string') {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
                this.date.setValue(this.formatDate(date));
            } else {
                this.date.setValue(null);
            }
        } else {
            this.date.setValue(null);
        }
    }
    /**
     * Registers a function to call when the value changes.
     * @param fn The function to register.
     */
    public registerOnChange(fn: (value: any) => void): void {
        this.onChange = (value: string) => {
            const date = new Date(value);
            fn(isNaN(date.getTime()) ? null : date.toISOString().split('T')[0]);
        };
    }
    /**
     * Registers a function to call when the control is touched.
     * @param fn The function to register.
     */
    public registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    /**
     * Sets the disabled state of the control.
     * @param isDisabled Whether the control is disabled.
     */
    public setDisabledState?(isDisabled: boolean): void {
        if (isDisabled) {
            this.date.disable();
            return
        }
        this.date.enable()
    }

    /**
     * Handles the change event from the native input element.
     * Updates the internal control and notifies the form.
     * @param event The DOM change event.
     */
    public onDateChange(event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        const value = inputElement.value;
        this.date.setValue(value);
        this.onChange(value);
        this.onTouched();
    }

    /**
     * Formats a given Date object into a string based on the current format setting.
     * @param date The Date object to format.
     * @returns The formatted date string.
     * @internal
     */
    private formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}
