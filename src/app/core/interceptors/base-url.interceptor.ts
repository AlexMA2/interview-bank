
import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '@env/environment';

export const EXCLUDE_URLS = ['i18n'];

export const baseUrlInterceptor: HttpInterceptorFn = (
    req,
    next
) => {

    const isExcluded = EXCLUDE_URLS.some((url) => req.url.startsWith('/' + url));
    if (isExcluded) {
        return next(req);
    }
    const isAbsolute = /^(http|https):\/\//i.test(req.url);

    if (isAbsolute) {
        return next(req);
    }
    const apiReq = isAbsolute
        ? req
        : req.clone({ url: `${environment.apiUrl}/${req.url}` });

    return next(apiReq);
}
