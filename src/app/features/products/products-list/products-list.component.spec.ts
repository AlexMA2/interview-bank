import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsListComponent } from './products-list.component';
import { of, throwError } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductsService } from '@products/apis/products/products.service';
import { ActivatedRoute } from '@angular/router';
import { SearchFieldComponent } from '@shared/ui/search-field/search-field.component';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { ItemMenuComponent } from '@products/components/item-menu/item-menu.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('ProductsListComponent', () => {
    let component: ProductsListComponent;
    let fixture: ComponentFixture<ProductsListComponent>;
    let productServiceSpy: jasmine.SpyObj<ProductsService>;

    let translateServiceSpy: jasmine.SpyObj<TranslateService>;
    // Valid mock products
    const mockProducts: Product[] = [
        {
            id: '1',
            name: 'Apple Card',
            description: 'Premium credit card',
            logo: 'apple.png',
            date_release: '2025-09-01',
            date_revision: '2026-09-01',
        },
        {
            id: '2',
            name: 'Banana Loan',
            description: 'Low interest loan',
            logo: 'banana.png',
            date_release: '2025-10-10',
            date_revision: '2026-10-10',
        },
        {
            id: '3',
            name: 'Orange Savings',
            description: 'High yield savings account',
            logo: 'orange.png',
            date_release: '2025-12-15',
            date_revision: '2026-12-15',
        },
    ];

    beforeEach(async () => {
        productServiceSpy = jasmine.createSpyObj('ProductsService', ['getAll', 'delete']);
        productServiceSpy = jasmine.createSpyObj('ProductsService', ['getAll', 'delete']);
        translateServiceSpy = jasmine.createSpyObj('TranslateService', ['instant', 'get']);

        await TestBed.configureTestingModule({
            imports: [
                ProductsListComponent,
                SearchFieldComponent,
                ButtonComponent,
                ItemMenuComponent,
                TranslateModule.forRoot() // required for TranslateService
            ],
            providers: [
                { provide: ProductsService, useValue: productServiceSpy },
                { provide: TranslateService, useValue: translateServiceSpy },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: { paramMap: { get: () => null } },
                        params: of({}),
                        queryParams: of({})
                    }
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ProductsListComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('mock products should respect date rules', () => {
        const baseDate = new Date('2025-08-17');

        for (const product of mockProducts) {
            const release = new Date(product.date_release);
            const revision = new Date(product.date_revision);

            expect(release.getTime()).toBeGreaterThan(baseDate.getTime());
            expect(revision.getFullYear()).toBe(release.getFullYear() + 1);
            expect(revision.getMonth()).toBe(release.getMonth());
            expect(revision.getDate()).toBe(release.getDate());
        }
    });

    describe('ngOnInit', () => {
        it('should load products on init', () => {
            productServiceSpy.getAll.and.returnValue(of({ data: mockProducts, message: 'Products fetched successfully' }));

            component.ngOnInit();

            expect(productServiceSpy.getAll).toHaveBeenCalled();
            expect(component['products']()).toEqual(mockProducts.sort((a, b) => a.name.localeCompare(b.name)));
            expect(component.loading().fetching).toBeFalse();
        });
    });

    describe('onSearch', () => {
        it('should update search signal', () => {
            component.onSearch('apple');
            expect(component['search']()).toBe('apple');
        });

        it('should filter datasource based on search', () => {
            component['products'].set(mockProducts);
            component.onSearch('apple');

            const result = component['datasource']();
            expect(result.length).toBe(1);
            expect(result[0].name).toBe('Apple Card');
        });
    });

    describe('onPageSizeChange', () => {
        it('should update pageSize signal', () => {
            const event = { target: { value: '10' } } as unknown as Event;
            component.onPageSizeChange(event);
            expect(component['pageSize']()).toBe(10);
        });
    });

    describe('onDelete', () => {
        it('should set toDelete with product by id', () => {
            component['products'].set(mockProducts);
            component.onDelete('2');
            expect(component['toDelete']()).toEqual(mockProducts[1]);
        });

        it('should set null if product not found', () => {
            component['products'].set(mockProducts);
            component.onDelete('999');
            expect(component['toDelete']()).toBeNull();
        });
    });

    describe('onCancelDelete', () => {
        it('should reset toDelete to null', () => {
            component['toDelete'].set(mockProducts[0]);
            component.onCancelDelete();
            expect(component['toDelete']()).toBeNull();
        });
    });

    describe('onConfirmDelete', () => {
        it('should call service delete and refresh products', () => {
            component['products'].set(mockProducts);
            component.onDelete('1');
            productServiceSpy.delete.and.returnValue(of({
                data: undefined,
                message: 'Product deleted successfully'
            }));
            productServiceSpy.getAll.and.returnValue(of({ data: mockProducts.slice(1), message: 'Products fetched successfully' }));

            component.onConfirmDelete();

            expect(productServiceSpy.delete).toHaveBeenCalledWith('1');
            expect(productServiceSpy.getAll).toHaveBeenCalled();
        });

        it('should handle delete error gracefully', () => {
            component['products'].set(mockProducts);
            component.onDelete('1');
            productServiceSpy.delete.and.returnValue(throwError(() => new Error('delete failed')));

            component.onConfirmDelete();

            expect(productServiceSpy.delete).toHaveBeenCalledWith('1');
            expect(component.loading().deleting.has('1')).toBeFalse();
        });

        it('should not call delete if toDelete is null', () => {
            component.onConfirmDelete();
            expect(productServiceSpy.delete).not.toHaveBeenCalled();
        });
    });
});
