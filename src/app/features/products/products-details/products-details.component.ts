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
import { DateFormat, Dates } from '@shared/utils/functions/dates';
import { generateRandomProduct } from '@shared/utils/functions/seedProducts';
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
        RouterModule
    ],
    templateUrl: './products-details.component.html',
    styleUrl: './products-details.component.scss',
})
export class ProductsDetailsComponent implements OnInit {
    protected formGroup: FormGroup;
    protected readonly verificationService = inject(IdVerificationService);
    protected readonly productsService = inject(ProductsService);
    protected readonly translateService = inject(TranslateService);
    protected readonly router = inject(Router);

    protected loading = signal({
        fetching: false,
        saving: false,
    });

    private activatedRoute = inject(ActivatedRoute);

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
                DateValidator.dateFormat(),
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

    protected id = signal<string | null>(null);

    ngOnInit(): void {
        this.listenToReleaseChange();


        this.activatedRoute.paramMap.subscribe(params => {
            this.id.set(params.get('id'));

            if (!this.id()) return
            this.formGroup.controls['id'].disable();
            this.getById(this.id()!);
        });
    }

    public getById(id: string): void {
        this.loading.update(s => ({ ...s, fetching: true }));
        this.productsService.get(id).subscribe({
            next: (response) => {
                console.log('🚀 ~ ProductsDetailsComponent ~ getById ~ response:', response)
                this.patchValue(response);
                this.loading.update(s => ({ ...s, fetching: false }));
            },
            error: () => {
                this.loading.update(s => ({ ...s, fetching: false }));
            }
        });
    }

    public patchValue(product: Product) {
        const date_release = Dates.parseFormatStringToDate(product.date_release);
        const date_revision = Dates.formatDate(product.date_revision, DateFormat.DD_MM_YYYY)

        this.formGroup.patchValue({
            ...product,
            date_release,
            date_revision,
        });
    }

    public onRestart(): void {
        this.formGroup.reset();
        this.formGroup.markAsPristine();
    }

    public onSubmit(): void {
        console.log(this.formGroup.value);
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

    public onCreate(): void {
        this.productsService.create(this.parseRequestDates(this.formGroup.getRawValue())).subscribe({
            next: () => {
                this.router.navigate(['products']);
                this.loading.update(s => ({ ...s, saving: false }));
                this.formGroup.enable();
            },
            error: () => {
                this.formGroup.markAllAsTouched();
                this.formGroup.enable();
                this.loading.update(s => ({ ...s, saving: false }));
            }
        });
    }

    public onEdit(): void {
        this.productsService.update(this.id()!, this.parseRequestDates(this.formGroup.getRawValue())).subscribe({
            next: () => {
                this.loading.update(s => ({ ...s, saving: false }));

                this.formGroup.controls['name'].enable();
                this.formGroup.controls['description'].enable();
                this.formGroup.controls['logo'].enable();
                this.formGroup.controls['date_release'].enable();

                this.formGroup.markAsPristine();

            },
            error: () => {
                this.formGroup.markAllAsTouched();
                this.formGroup.enable();
                this.loading.update(s => ({ ...s, saving: false }));
            }
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private parseRequestDates(payload: any): Product {
        return {
            ...payload,
            date_release: Dates.formatDate(payload.date_release, DateFormat.YYYY_MM_DD),
            date_revision: Dates.formatDate(payload.date_revision, DateFormat.YYYY_MM_DD),
        }
    }

    private listenToReleaseChange(): void {
        this.formGroup.get('date_release')?.valueChanges.subscribe((value: Date) => {

            this.formGroup.get('date_revision')?.setValue(Dates.formatDate(Dates.addYears(value, 1), DateFormat.DD_MM_YYYY));
        });
    }
}
