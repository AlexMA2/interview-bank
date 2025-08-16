/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

@Injectable()
export class BaseUrlInterceptor implements HttpInterceptor {
    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const isAbsolute = /^(http|https):\/\//i.test(request.url);
        const apiReq = isAbsolute
            ? request
            : request.clone({ url: `${environment.apiUrl}/${request.url}` });

        return next.handle(apiReq);
    }
}
