import { Dates, DateFormat } from './dates';

describe('Dates utility', () => {
    describe('formatDate', () => {
        it('should format date as YYYY-MM-DD', () => {
            const date = new Date(2025, 7, 16); // meses empiezan en 0
            expect(Dates.formatDate(date, DateFormat.YYYY_MM_DD)).toBe('2025-08-16');
        });

        it('should format date as MM/DD/YYYY', () => {
            const date = new Date(2025, 7, 16);
            expect(Dates.formatDate(date, DateFormat.MM_DD_YYYY)).toBe('08/16/2025');
        });

        it('should format date as DD/MM/YYYY', () => {
            const date = new Date(2025, 7, 16);
            expect(Dates.formatDate(date, DateFormat.DD_MM_YYYY)).toBe('16/08/2025');
        });

        it('should return empty string for invalid date', () => {
            expect(Dates.formatDate('not-a-date', DateFormat.YYYY_MM_DD)).toBe('');
        });
    });

    describe('isToday', () => {
        it('should return true for today', () => {
            const today = new Date();
            expect(Dates.isToday(today)).toBeTrue();
        });

        it('should return false for yesterday', () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            expect(Dates.isToday(yesterday)).toBeFalse();
        });
    });

    describe('addYears', () => {
        it('should add years correctly', () => {
            const date = new Date(2020, 0, 1);
            const result = Dates.addYears(date, 5);
            expect(result.getFullYear()).toBe(2025);
        });
    });

    describe('validateDateFormat', () => {
        it('should validate YYYY-MM-DD correctly', () => {
            expect(Dates.validateDateFormat('2025-08-16', DateFormat.YYYY_MM_DD)).toBeTrue();
            expect(Dates.validateDateFormat('16-08-2025', DateFormat.YYYY_MM_DD)).toBeFalse();
        });

        it('should validate MM/DD/YYYY correctly', () => {
            expect(Dates.validateDateFormat('08/16/2025', DateFormat.MM_DD_YYYY)).toBeTrue();
            expect(Dates.validateDateFormat('16/08/2025', DateFormat.MM_DD_YYYY)).toBeFalse();
        });

        it('should validate DD/MM/YYYY correctly', () => {
            expect(Dates.validateDateFormat('16/08/2025', DateFormat.DD_MM_YYYY)).toBeTrue();
            expect(Dates.validateDateFormat('08/16/2025', DateFormat.DD_MM_YYYY)).toBeFalse();
        });
    });
});
