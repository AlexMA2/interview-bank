import { Component } from '@angular/core';
import { SearchFieldComponent } from '@shared/ui/search-field/search-field.component';

@Component({
    selector: 'app-products-list',
    imports: [SearchFieldComponent],
    templateUrl: './products-list.component.html',
    styleUrl: './products-list.component.scss',
})
export class ProductsListComponent {}
