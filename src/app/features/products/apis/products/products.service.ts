import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.model';
import { ApiResponse } from '@shared/models/http.model';

@Injectable({
    providedIn: 'root',
})
export class ProductsService {
    private readonly baseUrl = 'bp/products';

    private http = inject(HttpClient);


    public getAll(): Observable<ApiResponse<Product[]>> {
        return this.http.get<ApiResponse<Product[]>>(this.baseUrl);
    }

    public get(id: string): Observable<ApiResponse<Product>> {
        return this.http.get<ApiResponse<Product>>(`${this.baseUrl}/${id}`);
    }

    public create(product: Product): Observable<ApiResponse<Product>> {
        return this.http.post<ApiResponse<Product>>(this.baseUrl, product);
    }

    public update(
        id: string,
        product: Partial<Product>
    ): Observable<ApiResponse<Product[]>> {
        return this.http.put<ApiResponse<Product[]>>(
            `${this.baseUrl}/${id}`,
            product
        );
    }

    public delete(id: string): Observable<ApiResponse<undefined>> {
        return this.http.delete<ApiResponse<undefined>>(
            `${this.baseUrl}/${id}`
        );
    }
}
