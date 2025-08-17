import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IdVerificationService } from '@products/apis/id-verification/id-verification.service';
import { ProductsService } from '@products/apis/products/products.service';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { DatePickerComponent } from '@shared/ui/date-picker/date-picker.component';
import { InputComponent } from '@shared/ui/input/input.component';
import { of, throwError } from 'rxjs';

import { Product } from '../models/product.model';
import { ProductsDetailsComponent } from './products-details.component';
import { provideHttpClient } from '@angular/common/http';

describe('ProductsDetailsComponent', () => {
    let component: ProductsDetailsComponent;
    let fixture: ComponentFixture<ProductsDetailsComponent>;
    let productsServiceSpy: jasmine.SpyObj<ProductsService>;
    let routerSpy: jasmine.SpyObj<Router>;
    let translateSpy: jasmine.SpyObj<TranslateService>;
    let verificationSpy: jasmine.SpyObj<IdVerificationService>;

    beforeEach(async () => {
        productsServiceSpy = jasmine.createSpyObj('ProductsService', ['get', 'create', 'update']);
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        translateSpy = jasmine.createSpyObj('TranslateService', ['instant']);
        verificationSpy = jasmine.createSpyObj('IdVerificationService', ['verify']);

        await TestBed.configureTestingModule({
            imports: [
                ProductsDetailsComponent,
                ReactiveFormsModule,
                TranslateModule.forRoot(),
                InputComponent,
                ButtonComponent,
                DatePickerComponent,
            ],
            providers: [
                { provide: ProductsService, useValue: productsServiceSpy },
                { provide: Router, useValue: routerSpy },
                { provide: TranslateService, useValue: translateSpy },
                { provide: IdVerificationService, useValue: verificationSpy },
                { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ id: null })) } },
                provideHttpClient(),
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ProductsDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should patch values correctly', () => {
        const product: Product = {
            id: '1',
            name: 'Producto',
            description: 'Descripción larga',
            logo: 'http://logo.com/logo.png',
            date_release: '2025-08-16',
            date_revision: '2026-08-16'
        };
        component.patchValue(product);
        const fg = component['formGroup'];
        expect(fg.get('name')?.value).toBe('Producto');
        expect(fg.get('logo')?.value).toBe('http://logo.com/logo.png');
    });

    it('should reset form on onRestart', () => {
        const fg = component['formGroup'];
        fg.get('name')?.setValue('Test');
        component.onRestart();
        expect(fg.get('name')?.value).toBeNull();
        expect(fg.pristine).toBeTrue();
    });

    it('should call onCreate when submitting new product', fakeAsync(() => {
        const fg = component['formGroup'];
        fg.get('name')?.setValue('Producto Test');
        fg.get('description')?.setValue('Descripcion Test larga');
        fg.get('logo')?.setValue('http://logo.com/logo.png');
        fg.get('date_release')?.setValue(new Date('2025-11-25'));
        tick(); // para que se ejecute listenToReleaseChange
        const createSpy = productsServiceSpy.create.and.returnValue(of({} as any));
        component.onSubmit();
        tick();
        expect(createSpy).toHaveBeenCalled();
    }));

    it('should call onEdit when submitting existing product', fakeAsync(() => {
        component['id'].set('123');
        const fg = component['formGroup'];
        fg.get('name')?.setValue('Producto Test');
        fg.get('description')?.setValue('Descripcion Test larga');
        fg.get('logo')?.setValue('http://logo.com/logo.png');
        fg.get('date_release')?.setValue(new Date('2025-11-25'));
        tick();
        const updateSpy = productsServiceSpy.update.and.returnValue(of({} as any));
        component.onSubmit();
        tick();
        expect(updateSpy).toHaveBeenCalledWith('123', jasmine.any(Object));
    }));

    it('should handle getById success correctly', fakeAsync(() => {
        const product: Product = {
            id: '123',
            name: 'Test',
            description: 'Desc',
            logo: 'http://logo.com/logo.png',
            date_release: '2025-08-16',
            date_revision: '2026-08-16'
        };
        productsServiceSpy.get.and.returnValue(of(product));
        component.getById('123');
        tick();
        const loading = component['loading']();
        expect(loading.fetching).toBeFalse();
        expect(component['formGroup'].get('name')?.value).toBe('Test');
    }));

    it('should handle getById error correctly', fakeAsync(() => {
        productsServiceSpy.get.and.returnValue(throwError(() => new Error('Error')));
        component.getById('123');
        tick();
        const loading = component['loading']();
        expect(loading.fetching).toBeFalse();
    }));

    it('should update date_revision when date_release changes', fakeAsync(() => {
        const fg = component['formGroup'];
        const newDate = new Date('2025-08-16');
        fg.get('date_release')?.setValue(newDate);
        tick();
        const dateRev = fg.get('date_revision')?.value;
        expect(dateRev).toBeDefined();
    }));
});
