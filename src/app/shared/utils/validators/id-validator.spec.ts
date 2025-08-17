/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormControl } from '@angular/forms';
import { IdValidator } from './id-validator';
import { Observable, of, throwError } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';

// Creamos un mock sencillo del servicio
class MockIdVerificationService {
    get = jasmine.createSpy('get');
}

describe('IdValidator', () => {
    let service: MockIdVerificationService;

    beforeEach(() => {
        service = new MockIdVerificationService();
    });

    it('should return null if control has no value', fakeAsync(() => {
        const control = new FormControl('');
        const validatorFn = IdValidator.idExists(service as any);

        let result: any;
         (validatorFn(control) as Observable<any>).subscribe(r => result = r);
        tick(500); // esperamos más que delayMs
        expect(result).toBeNull();
        expect(service.get).not.toHaveBeenCalled();
    }));

    it('should return error if id already exists', fakeAsync(() => {
        service.get.and.returnValue(of(true)); // true = ya existe
        const control = new FormControl('123');
        const validatorFn = IdValidator.idExists(service as any, 200);

        let result: any;
         (validatorFn(control) as Observable<any>).subscribe(r => result = r);
        tick(200);

        expect(service.get).toHaveBeenCalledWith('123');
        expect(result).toEqual({ idExists: true });
    }));

    it('should return null if id does not exist', fakeAsync(() => {
        service.get.and.returnValue(of(false)); // false = libre
        const control = new FormControl('456');
        const validatorFn = IdValidator.idExists(service as any, 200);

        let result: any;
        (validatorFn(control) as Observable<any>).subscribe(r => result = r);
        tick(200);

        expect(service.get).toHaveBeenCalledWith('456');
        expect(result).toBeNull();
    }));

    it('should return null if service throws error', fakeAsync(() => {
        service.get.and.returnValue(throwError(() => new Error('network error')));
        const control = new FormControl('789');
        const validatorFn = IdValidator.idExists(service as any, 200);

        let result: any;
         (validatorFn(control) as Observable<any>).subscribe(r => result = r);
        tick(200);

        expect(service.get).toHaveBeenCalledWith('789');
        expect(result).toBeNull();
    }));
});
