import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IdVerificationService } from '@products/apis/id-verification/id-verification.service';
import { ProductsService } from '@products/apis/products/products.service';
import { Product } from '@products/models/product.model';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { DatePickerComponent } from '@shared/ui/date-picker/date-picker.component';
import { InputComponent } from '@shared/ui/input/input.component';
import { ToastComponent } from '@shared/ui/toast/toast.component';
import { ToastService } from '@shared/ui/toast/toast.service';
import { DateFormat, Dates } from '@shared/utils/functions/dates';
import { DateValidator } from '@shared/utils/validators/date-validator';
import { IdValidator } from '@shared/utils/validators/id-validator';
import { UrlValidator } from '@shared/utils/validators/url-validator';

@Component({
    selector: 'app-products-details',
    imports: [
        TranslateModule,
        InputComponent,
        ReactiveFormsModule,
        ButtonComponent,
        DatePickerComponent,
        RouterModule,
        ToastComponent
    ],
    templateUrl: './products-details.component.html',
    styleUrl: './products-details.component.scss',
})
export class ProductsDetailsComponent implements OnInit {
    /**
     * Form group
     */
    public formGroup: FormGroup;
    /**
     * Loading status
     */
    protected loading = signal({
        fetching: false,
        saving: false,
    });
    /**
     * Product id. If nulls, means that its a new product
     */
    protected id = signal<string | null>(null);
    /**
     * Activated route injection
     */
    private activatedRoute = inject(ActivatedRoute);
    /**
     * Toast injection
     */
    private toast = inject(ToastService);
    /**
     * Service to verify id
     */
    protected readonly verificationService = inject(IdVerificationService);
    /**
     * Service to get products, create and update
     */
    protected readonly productsService = inject(ProductsService);
    /**
     * Translate service
     */
    protected readonly translateService = inject(TranslateService);
    /**
     * Router
     */
    protected readonly router = inject(Router);

    constructor() {
        this.formGroup = new FormGroup({
            id: new FormControl<string | null>(null, {
                validators: [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(10),
                ],
                asyncValidators: [
                    IdValidator.idExists(this.verificationService),
                ],
                updateOn: 'blur',
            }),
            name: new FormControl<string | null>(null, [
                Validators.required,
                Validators.minLength(5),
                Validators.maxLength(100),
            ]),
            description: new FormControl<string | null>(null, [
                Validators.required,
                Validators.minLength(10),
                Validators.maxLength(200),
            ]),
            logo: new FormControl<string | null>(null, [
                Validators.required,
                UrlValidator.isUrl,
            ]),
            date_release: new FormControl<Date | null>(null, [
                Validators.required,
                DateValidator.minDateValidator(),
            ]),
            date_revision: new FormControl<string | null>({
                value: null,
                disabled: true,
            }, [
                Validators.required,
            ]),
        });
    }

    ngOnInit(): void {
        this.listenToActivatedRoute();
        this.listenToReleaseChange();
    }
    /**
     * Listen to the activated route to get the id of the product
     */
    private listenToActivatedRoute(): void {
        this.activatedRoute.paramMap.subscribe(params => {
            this.id.set(params.get('id'));

            if (!this.id()) return
            this.formGroup.controls['id'].disable();
            this.getById(this.id()!);
        });
    }
    /**
     * Search the data of an existing product
     * @param id : string - Id of the product
     */
    public getById(id: string): void {
        this.loading.update(s => ({ ...s, fetching: true }));
        this.productsService.get(id).subscribe({
            next: (response) => {
                this.patchValue(response);
                this.loading.update(s => ({ ...s, fetching: false }));
            },
            error: () => {
                this.loading.update(s => ({ ...s, fetching: false }));
            }
        });
    }
    /**
     * Patch the values of the object into the form group
     * @param product : Product - Òbject to be patched
     */
    public patchValue(product: Product) {
        const date_release = Dates.parseFormatStringToDate(product.date_release);
        const date_revision = Dates.formatDate(product.date_revision, DateFormat.DD_MM_YYYY)

        this.formGroup.patchValue({
            ...product,
            date_release,
            date_revision,
        });
    }
    /**
     * Reset the form
     */
    public onRestart(): void {
        this.formGroup.reset();
        this.formGroup.markAsPristine();
    }

    /**
     * Check if the form is valid and submit the product.
     * Switch between product creation and edition
     */
    public onSubmit(): void {
        if (this.formGroup.invalid) {
            this.formGroup.markAllAsTouched();
            return
        }
        this.loading.update(s => ({ ...s, saving: true }));
        this.formGroup.disable();

        if (this.id()) {
            this.onEdit();
        } else {
            this.onCreate();
        }
    }
    /**
     * Manage the product creation
     */
    public onCreate(): void {
        this.productsService.create(this.parseRequestDates(this.formGroup.getRawValue())).subscribe({
            next: () => {

                this.loading.update(s => ({ ...s, saving: false }));

                this.toast.open('success', this.translateService.instant('product.created', {
                    value: this.formGroup.controls['name'].value
                }));

                this.router.navigate(['products']);

            },
            error: (error: HttpErrorResponse) => {
                this.formGroup.markAllAsTouched();
                this.formGroup.enable();
                this.loading.update(s => ({ ...s, saving: false }));

                if (error.status === 400) {
                    this.toast.open('error', this.translateService.instant('errors.product_creation'));
                    return
                }

                this.toast.open('error', this.translateService.instant('errors.server_error'));
            }
        });
    }
    /**
     * Manage the product edition
     */
    public onEdit(): void {
        this.productsService.update(this.id()!, this.parseRequestDates(this.formGroup.getRawValue())).subscribe({
            next: () => {
                this.loading.update(s => ({ ...s, saving: false }));

                this.formGroup.controls['name'].enable();
                this.formGroup.controls['description'].enable();
                this.formGroup.controls['logo'].enable();
                this.formGroup.controls['date_release'].enable();

                this.formGroup.markAsPristine();

                this.toast.open('success', this.translateService.instant('product.edited', {
                    value: this.formGroup.controls['name'].value
                }));
            },
            error: (error: HttpErrorResponse) => {
                this.formGroup.markAllAsTouched();
                this.formGroup.enable();
                this.loading.update(s => ({ ...s, saving: false }));

                if (error.status === 404) {
                    this.toast.open('error', this.translateService.instant('errors.not_found.product', { value: this.id() }));
                    return
                }

                this.toast.open('error', this.translateService.instant('errors.server_error'))
            }
        });
    }
    /**
     * Parse the dates properties according to the payload need for the edition or creation.
     * @param payload : Product - Product to be updated
     * @returns Product - Product with date_release and date_revision formatted
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private parseRequestDates(payload: any): Product {
        return {
            ...payload,
            date_release: Dates.formatDate(payload.date_release, DateFormat.YYYY_MM_DD),
            date_revision: Dates.formatDate(payload.date_revision, DateFormat.YYYY_MM_DD),
        }
    }
    /**
     * Listen to changes in the date_release field and update the date_revision field accordingly.
     */
    private listenToReleaseChange(): void {
        this.formGroup.get('date_release')?.valueChanges.subscribe((value: Date) => {

            this.formGroup.get('date_revision')?.setValue(Dates.formatDate(Dates.addYears(value, 1), DateFormat.DD_MM_YYYY));
        });
    }
}
