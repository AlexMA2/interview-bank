import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Product } from '@products/models/product.model';
import { ApiResponse } from '@shared/models/http.model';

import { ProductsService } from './products.service';

describe('ProductService', () => {
    let service: ProductsService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ProductsService,
                provideHttpClient(),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(ProductsService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should retrieve all products', () => {
        const mockResponse: ApiResponse<Product[]> = {
            data: [{
                id: '2',
                name: 'Product 2',
                description: 'Description 2',
                logo: 'Logo 2',
                date_release: '2026-01-01',
                date_revision: '2026-01-02',
            }],
            message: 'Success'
        };

        service.getAll().subscribe((response: ApiResponse<Product[]>) => {
            expect(response.data.length).toBe(1);
            expect(response.data[0].name).toBe('Product 2');
        });

        const req = httpMock.expectOne('bp/products');
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should retrieve a product by id', () => {
        const mockProduct: Product = {
            id: '1',
            name: 'Product 1',
            description: 'Description 1',
            logo: 'Logo 1',
            date_release: '2026-01-01',
            date_revision: '2026-01-02',
        };

        service.get('1').subscribe((product: Product) => {
            expect(product.id).toBe('1');
            expect(product.name).toBe('Product 1');
        });

        const req = httpMock.expectOne('bp/products/1');
        expect(req.request.method).toBe('GET');
        req.flush(mockProduct);
    });

    it('should create a new product', () => {
        const newProduct: Product = {
            id: '2',
            name: 'Product 2',
            description: 'Description 2',
            logo: 'Logo 2',
            date_release: '2026-01-01',
            date_revision: '2026-01-02',
        };
        const mockResponse = { data: newProduct };

        service.create(newProduct).subscribe((response: ApiResponse<Product>) => {
            expect(response.data.id).toBe('2');
            expect(response.data.name).toBe('Product 2');
        });

        const req = httpMock.expectOne('bp/products');
        expect(req.request.method).toBe('POST');
        req.flush(mockResponse);
    });

    it('should update an existing product', () => {
        const updatedProduct: Partial<Product> = {
            name: 'Updated Product',
            description: 'Updated description',
            logo: 'Updated logo',
            date_release: '2022-01-01',
            date_revision: '2022-01-02',
        };
        const mockResponse = { data: [updatedProduct] };

        service.update('1', updatedProduct).subscribe((response: ApiResponse<Product>) => {

            expect(response.data.name).toBe('Updated Product');
        });

        const req = httpMock.expectOne('bp/products/1');
        expect(req.request.method).toBe('PUT');
        req.flush(mockResponse);
    });

    it('should delete a product', () => {
        const mockResponse = { data: undefined };

        service.delete('1').subscribe((response: ApiResponse<undefined>) => {
            expect(response.data).toBeUndefined();
        });

        const req = httpMock.expectOne('bp/products/1');
        expect(req.request.method).toBe('DELETE');
        req.flush(mockResponse);
    });
});
