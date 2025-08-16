import {
    AbstractControl,
    AsyncValidatorFn,
    ValidationErrors,
} from '@angular/forms';
import { IdVerificationService } from '@products/apis/id-verification/id-verification.service';
import { catchError, map, Observable, of, switchMap, timer } from 'rxjs';

export class IdValidator {
    static idExists(
        service: IdVerificationService,
        delayMs = 300
    ): AsyncValidatorFn {
        return (
            control: AbstractControl
        ): Observable<ValidationErrors | null> => {
            if (!control.value) {
                return of(null);
            }
            return timer(delayMs).pipe(
                switchMap(() => service.get(control.value.trim())),
                map((isTaken: boolean) =>
                    isTaken ? { idExists: true } : null
                ),
                catchError(() => of(null))
            );
        };
    }
}
