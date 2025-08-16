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


export class Dates {

    /**
    * Formats a given Date object into a string based on the current format setting.
    * @param date The Date object to format.
    * @param format The desired date format.
    * @returns The formatted date string.
    * @internal
    */
    static formatDate(date: string | Date | null, format: DateFormat): string {
        if (!date) {
            return '';
        }

        const parsedDate = Dates.parseFormatStringToDate(date);

        if (!parsedDate || Dates.isInvalidDate(parsedDate)) {
            return '';
        }

        const year = parsedDate.getFullYear();
        const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
        const day = parsedDate.getDate().toString().padStart(2, '0');

        switch (format) {
            case DateFormat.MM_DD_YYYY:
                return `${month}/${day}/${year}`;
            case DateFormat.DD_MM_YYYY:
                return `${day}/${month}/${year}`;
            case DateFormat.YYYY_MM_DD:
            default:
                return `${year}-${month}-${day}`;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static isInvalidDate(date: any): boolean {
        return !(date instanceof Date) || isNaN(date.getTime());
    }

    static addYears(date: Date, years = 1): Date {
        if (Dates.isInvalidDate(date)) {
            throw new Error('Invalid date:' + date);
        }
        const result = new Date(date);
        result.setFullYear(result.getFullYear() + years);
        return result;
    }

    static isToday(date: Date): boolean {
        if (Dates.isInvalidDate(date)) {
            throw new Error('Invalid date: ' + date);
        }
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    }

    static parseFormatStringToDate(dateString: string | null | Date): Date | null {
        if (!dateString) return null;
        if (dateString instanceof Date) {
            return dateString;
        }
        const format = Dates.getFormatString(dateString);
        switch (format) {
            case DateFormat.YYYY_MM_DD: {
                 const [y, m, d] = dateString.split("-").map(Number);
                 return new Date(y, m - 1, d);
            }

            case DateFormat.DD_MM_YYYY: {
                const [d, m, y] = dateString.split("/").map(Number);
                return new Date(y, m - 1, d);
            }
            case DateFormat.MM_DD_YYYY: {
                const [m, d, y] = dateString.split("/").map(Number);
                return new Date(y, m - 1, d);
            }
        }
    }

    static getFormatString(value: string): DateFormat {
        if (Dates.validateDateFormat(value, DateFormat.YYYY_MM_DD)) {
            return DateFormat.YYYY_MM_DD;
        } else if (Dates.validateDateFormat(value, DateFormat.DD_MM_YYYY)) {
            return DateFormat.DD_MM_YYYY;
        } else if (Dates.validateDateFormat(value, DateFormat.MM_DD_YYYY)) {
            return DateFormat.MM_DD_YYYY;
        } else {
            return DateFormat.YYYY_MM_DD;
        }
    }

    static validateDateFormat(value: string, format: DateFormat): boolean {
        if (!value) return false;

        let regex: RegExp;

        switch (format) {
            case DateFormat.YYYY_MM_DD:
                regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
                break;

            case DateFormat.MM_DD_YYYY:
                regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
                break;

            case DateFormat.DD_MM_YYYY:
                regex = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
                break;

            default:
                return false;
        }

        return regex.test(value);
    }
}
