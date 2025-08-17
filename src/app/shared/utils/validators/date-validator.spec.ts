import { FormControl } from '@angular/forms';
import { DateValidator } from './date-validator';
import { DateFormat } from '../functions/dates';

describe('DateValidator', () => {

    describe('dateFormat', () => {
        it('should return null for valid DD/MM/YYYY date', () => {
            const control = new FormControl('16/08/2025');
            const validator = DateValidator.dateFormat(DateFormat.DD_MM_YYYY);
            expect(validator(control)).toBeNull();
        });

        it('should return error for invalid DD/MM/YYYY date', () => {
            const control = new FormControl('2025-08-16'); // formato incorrecto
            const validator = DateValidator.dateFormat(DateFormat.DD_MM_YYYY);
            const result = validator(control);
            expect(result).toEqual({ invalidDateFormat: DateFormat.DD_MM_YYYY });
        });
    });

    describe('minDateValidator', () => {
        it('should return null if date is after minDate', () => {
            const minDate = new Date(2025, 7, 16); // 16-08-2025
            const control = new FormControl('2025-08-17');
            const validator = DateValidator.minDateValidator(minDate);
            expect(validator(control)).toBeNull();
        });

        it('should return error if date is before minDate', () => {
            const minDate = new Date(2025, 7, 16);
            const control = new FormControl('2025-08-15');
            const validator = DateValidator.minDateValidator(minDate);
            const result = validator(control);
            expect(result).toEqual({ minDate: '16/08/2025' });
        });

        it('should return null if control has no value', () => {
            const control = new FormControl(null);
            const validator = DateValidator.minDateValidator(new Date());
            expect(validator(control)).toBeNull();
        });
    });
});
