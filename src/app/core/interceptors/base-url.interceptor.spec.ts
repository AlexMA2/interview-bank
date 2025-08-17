import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { baseUrlInterceptor } from './base-url.interceptor';

// Mock env
const environment = {
    apiUrl: 'http://localhost:3002'
};

describe('baseUrlInterceptor', () => {
    let http: HttpClient;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(
                    withInterceptors([baseUrlInterceptor])
                ),
                provideHttpClientTesting()
            ],
        });

        http = TestBed.inject(HttpClient);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should not modify excluded urls', () => {
        http.get('/i18n/es.json').subscribe();

        const req = httpMock.expectOne('/i18n/es.json');
        expect(req.request.url).toBe('/i18n/es.json');
        req.flush({});
    });

    it('should not modify absolute urls', () => {
        http.get('https://external.com/data').subscribe();

        const req = httpMock.expectOne('https://external.com/data');
        expect(req.request.url).toBe('https://external.com/data');
        req.flush({});
    });

    it('should prepend baseUrl to relative urls', () => {
        http.get('users').subscribe();

        const req = httpMock.expectOne(`${environment.apiUrl}/users`);
        expect(req.request.url).toBe(`${environment.apiUrl}/users`);
        req.flush({});
    });
});
