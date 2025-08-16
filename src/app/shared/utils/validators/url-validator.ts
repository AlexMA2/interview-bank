import { AbstractControl, ValidationErrors } from '@angular/forms';

export class UrlValidator {
    static isUrl(control: AbstractControl): ValidationErrors | null {
        const val = control.value;
        if (!val) return null;
        try {
            const parsed = new URL(val);
            return parsed.host && parsed.origin !== 'null'
                ? null
                : { invalidUrl: true };
        } catch {
            return { invalidUrl: true };
        }
    }
}
