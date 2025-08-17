import { TestBed } from '@angular/core/testing';

import { IdVerificationService } from './id-verification.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('IdVerificationService', () => {
    let service: IdVerificationService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                IdVerificationService,
                provideHttpClient(),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(IdVerificationService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should check if it exists', () => {

        const mockId = '1';
        service.get(mockId).subscribe((response: boolean) => {
            expect(response).toBeTrue();
        });

        const req = httpMock.expectOne(`bp/products/verification/${mockId}`);
        req.flush(true);

        const idNotExist = '999';
        service.get(idNotExist).subscribe(result => {
            expect(result).toBeFalse();
        });

        const req2 = httpMock.expectOne(`bp/products/verification/${idNotExist}`);
        req2.flush(false);
    });
});
