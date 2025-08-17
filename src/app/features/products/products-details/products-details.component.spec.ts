import { Directive, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IdVerificationService } from '@products/apis/id-verification/id-verification.service';
import { ProductsService } from '@products/apis/products/products.service';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { DatePickerComponent } from '@shared/ui/date-picker/date-picker.component';
import { InputComponent } from '@shared/ui/input/input.component';
import { Observable, of } from 'rxjs';

import { Product } from '../models/product.model';
import { ProductsDetailsComponent } from './products-details.component';
import { MockActivatedRoute } from '@shared/utils/_tests/MockActivateRoute';

@Directive({ selector: '[routerLink]', standalone: false })
class RouterLinkStubDirective {
  @Input('routerLink') linkParams: any;
}

const mockActivatedRoute = {
  paramMap: of([{id: 1}]),
  snapshot: { paramMap: convertToParamMap({ id: '123' }) },
  root: {} // agrega root si el componente lo usa
};

describe('ProductsDetailsComponent', () => {
    let component: ProductsDetailsComponent;
    let fixture: ComponentFixture<ProductsDetailsComponent>;

    let productsServiceSpy: jasmine.SpyObj<ProductsService>;
    let idVerificationServiceSpy: jasmine.SpyObj<IdVerificationService>;
    let translateServiceSpy: jasmine.SpyObj<TranslateService>;
    let routerSpy: jasmine.SpyObj<Router>;
    let activatedRouteStub: MockActivatedRoute;

    const mockProduct: Product = {
        id: '1',
        name: 'Apple Card',
        description: 'Premium credit card',
        logo: 'apple.png',
        date_release: '2025-09-01',
        date_revision: '2026-09-01',
    };


    beforeEach(async () => {
        productsServiceSpy = jasmine.createSpyObj('ProductsService', ['get', 'create', 'update']);
        idVerificationServiceSpy = jasmine.createSpyObj('IdVerificationService', ['verify']);
        translateServiceSpy = jasmine.createSpyObj('TranslateService', ['instant', 'get']);
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        activatedRouteStub = new MockActivatedRoute();

        await TestBed.configureTestingModule({
            imports: [
                ProductsDetailsComponent,
                InputComponent,
                ButtonComponent,
                DatePickerComponent,
                ReactiveFormsModule,
                TranslateModule.forRoot(),
            ],
            declarations: [RouterLinkStubDirective],
            providers: [
                { provide: ProductsService, useValue: productsServiceSpy },
                { provide: IdVerificationService, useValue: idVerificationServiceSpy },
                { provide: TranslateService, useValue: translateServiceSpy },
                { provide: Router, useValue: routerSpy },
                {
                    provide: ActivatedRoute,
                    useValue: activatedRouteStub
                },
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ProductsDetailsComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('mock product dates should respect rules', () => {
        const baseDate = new Date('2025-08-17');
        const release = new Date(mockProduct.date_release);
        const revision = new Date(mockProduct.date_revision);

        expect(release.getTime()).toBeGreaterThan(baseDate.getTime());
        expect(revision.getFullYear()).toBe(release.getFullYear() + 1);
        expect(revision.getMonth()).toBe(release.getMonth());
        expect(revision.getDate()).toBe(release.getDate());
    });

    it('should patch value from getById with proper date strings', () => {
        productsServiceSpy.get.and.returnValue(of(mockProduct));
        component.getById('1');
        expect(component.formGroup.value.date_release).toBe('2025-09-01');
        expect(component.formGroup.value.date_revision).toBe('2026-09-01');
    });

    it('onCreate should call productsService.create with correct date strings', () => {
        component.formGroup.patchValue(mockProduct);
        productsServiceSpy.create.and.returnValue(of({
            data: mockProduct,
            message: 'Product created successfully'
        }));
        component.onCreate();
        expect(productsServiceSpy.create).toHaveBeenCalledWith(jasmine.objectContaining({
            date_release: '2025-09-01',
            date_revision: '2026-09-01'
        }));
        expect(routerSpy.navigate).toHaveBeenCalledWith(['products']);
    });

    it('onEdit should call productsService.update with correct date strings', () => {
        component['id'].set('1');
        component.formGroup.patchValue(mockProduct);
        productsServiceSpy.update.and.returnValue(of({
            data: mockProduct,
            message: 'Product updated successfully'
        }));
        component.onEdit();
        expect(productsServiceSpy.update).toHaveBeenCalledWith('1', jasmine.objectContaining({
            date_release: '2025-09-01',
            date_revision: '2026-09-01'
        }));
    });

    it('onCreate should call productsService.create with correct date strings', () => {
        component.formGroup.patchValue(mockProduct);
        productsServiceSpy.create.and.returnValue(of({
            data: mockProduct,
            message: 'Product created successfully'
        }));
        component.onCreate();
        expect(productsServiceSpy.create).toHaveBeenCalledWith(jasmine.objectContaining({
            date_release: '2025-09-01',
            date_revision: '2026-09-01'
        }));
        expect(routerSpy.navigate).toHaveBeenCalledWith(['products']);
    });

    it('onEdit should call productsService.update with correct date strings', () => {
        component['id'].set('1');
        component.formGroup.patchValue(mockProduct);
        productsServiceSpy.update.and.returnValue(of({
            data: mockProduct,
            message: 'Product updated successfully'
        }));
        component.onEdit();
        expect(productsServiceSpy.update).toHaveBeenCalledWith('1', jasmine.objectContaining({
            date_release: '2025-09-01',
            date_revision: '2026-09-01'
        }));
    });
});
