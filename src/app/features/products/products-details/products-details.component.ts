import { Component, inject } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IdVerificationService } from '@products/apis/id-verification/id-verification.service';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { DatePickerComponent } from '@shared/ui/date-picker/date-picker.component';
import { InputComponent } from '@shared/ui/input/input.component';
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
    ],
    templateUrl: './products-details.component.html',
    styleUrl: './products-details.component.scss',
})
export class ProductsDetailsComponent {
    protected formGroup: FormGroup;
    protected readonly verificationService = inject(IdVerificationService);
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
            release: new FormControl<string | null>(null, [
                Validators.required,
                DateValidator.dateFormat(),
            ]),
            revision: new FormControl<string | null>({
                value: null,
                disabled: true,
            }, [
                Validators.required,
            ]),
        });
    }
}
