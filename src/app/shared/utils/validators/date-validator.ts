import { AbstractControl, ValidationErrors } from '@angular/forms';
import { DateFormat, Dates } from '../functions/dates';

export class DateValidator {
    /**
     * Validate if a date follows a specific format.
     * @param format : RegExp - regex to validate date, by default is : YYYY-MM-DD
     * @returns : ValidationErrors - if date is not valid, null otherwise
     */
    static dateFormat(
        format = DateFormat.DD_MM_YYYY
    ) {
        return (control: AbstractControl): ValidationErrors | null => {
            const val = control.value;
            return Dates.validateDateFormat(val, format) ? { invalidDateFormat: format } : null;
        };
    }

    /**
     * Validate if a date is the future of a specific date
     * @param minDate : Date - date to compare. By default is the current date
     * @returns : ValidationErrors - if date is the future of the minDate, null otherwise
     */
    static minDateValidator(minDate: Date = new Date()) {
        return (control: AbstractControl): ValidationErrors | null => {
            const val = control.value;
            if (!val) return null;

            const input = new Date(val);

            const normalizedInput = new Date(
                input.getFullYear(),
                input.getMonth(),
                input.getDate()
            );
            const normalizedMin = new Date(
                minDate.getFullYear(),
                minDate.getMonth(),
                minDate.getDate()
            );

            const isToday = Dates.isToday(minDate);

            return normalizedInput < normalizedMin
                ? { minDate: isToday ? 'time_system.today' : Dates.formatDate(minDate, DateFormat.DD_MM_YYYY) }
                : null;
        };
    }
}
