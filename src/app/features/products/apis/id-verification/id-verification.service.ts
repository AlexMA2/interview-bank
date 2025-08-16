import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class IdVerificationService {
    private readonly baseUrl = 'bp/products/verification';

    private http = inject(HttpClient);

    public get(id: string): Observable<boolean> {
        return this.http.get<boolean>(`${this.baseUrl}/${id}`);
    }
}
