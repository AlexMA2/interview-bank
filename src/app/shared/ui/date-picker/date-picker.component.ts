/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, computed, forwardRef, input, output } from '@angular/core';
import {
    ControlValueAccessor,
    FormControl,
    FormsModule,
    NG_VALUE_ACCESSOR,
    ReactiveFormsModule,
    ValidationErrors,
} from '@angular/forms';
import { DateFormat } from '@shared/utils/functions/dates';

import { Dates } from '../../utils/functions/dates';

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
export class DatePickerComponent implements ControlValueAccessor {
    /**
     * The label of the input.
     */
    public readonly label = input<string | undefined>();
    /**
     * The date format to display in the input. Defaults to YYYY-MM-DD.
     */
    public format = input<DateFormat>(DateFormat.DD_MM_YYYY);

    /**
     * The current date value of the component.
     */
    protected date = new FormControl<string | null>(null);
    /**
     * function for ControlValueAccessor.
     */
    protected onChange: (value: any) => void = () => { };

    /**
     * function for ControlValueAccessor.
     */
    protected onTouched: () => void = () => { };
    /**
     * A unique identifier for the input
     */
    protected readonly customId = computed(() => crypto.randomUUID());
    /**
     * Event emitter for date selected
     */
    public dateSelected = output<Date | null>();
    /**
     * Indicates whether the input has an error.
     */
    public readonly hasError = input<boolean, ValidationErrors | null | undefined>(false, {
        transform: (value) => value !== null && value !== undefined && Object.keys(value).length > 0,
    });
    /**
     * Writes a new value from the form model to the view.
     * @param value The new value from the form model.
     */
    public writeValue(value: any): void {
        if (value instanceof Date) {
            this.date.setValue(Dates.formatDate(value, this.format()));
        } else if (typeof value === 'string') {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
                this.date.setValue(Dates.formatDate(date, this.format()));
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
        this.onChange = fn
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

        const date = new Date(value + 'T00:00:00');
        this.dateSelected.emit(date);
        this.date.setValue(Dates.formatDate(date, this.format()));
        this.onChange(date);
        this.onTouched();
    }
}
