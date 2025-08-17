import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProductsService } from '@products/apis/products/products.service';
import { ItemMenuComponent } from '@products/components/item-menu/item-menu.component';
import { Product } from '@products/models/product.model';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { SearchFieldComponent } from '@shared/ui/search-field/search-field.component';
import { ToastComponent } from '@shared/ui/toast/toast.component';
import { ToastService } from '@shared/ui/toast/toast.service';
import { map } from 'rxjs';

@Component({
    selector: 'app-products-list',
    imports: [SearchFieldComponent, TranslateModule, RouterModule, ButtonComponent, ItemMenuComponent,
        ToastComponent],
    templateUrl: './products-list.component.html',
    styleUrl: './products-list.component.scss',
})
export class ProductsListComponent implements OnInit {

    /**
     * Loading state of the component.
     */
    public loading = signal({ fetching: false, deleting: new Set<string>() });
    /**
     * Datasource contains the data that has to be displayed in the table.
     * It change depending on the serach value and the page size
     */
    protected datasource = computed(() => {
        let values: Product[] = []
        if (this.search()) {
            values = this.products().filter(product => product.name.toLowerCase().includes(this.search()!.toLowerCase()))
        }
        else {
            values = this.products()
        }
        return values.slice(0, this.pageSize());
    });
    /**
     * Contains all the products fetched by the API.
     */
    protected products = signal<Product[]>([]);
    /**
     * Contains the page size. Default value is 5
     */
    protected pageSize = signal<5 | 10 | 20>(5);
    /**
     * Contains the search value. Null means no search
     */
    protected search = signal<string | null>(null);
    /**
     * Contains the product that has to be deleted. Used to display the confirmation modal
     */
    protected toDelete = signal<Product | null>(null);
    /**
     * Toast service
     */
    private toast = inject(ToastService);
    /**
     * Product service
     */
    public productService = inject(ProductsService);
    /**
     * Translate service
     */
    public translateService = inject(TranslateService);
    ngOnInit(): void {
        this.getProducts();
    }

    /**
     * Fetches all the products and manipulates the loading fetching status
     */
    private getProducts(): void {
        this.loading.update(s => ({ ...s, fetching: true }));
        this.productService.getAll().pipe(
            map((response) => ({
                ...response,
                data: response.data.sort((a, b) => a.name.localeCompare(b.name)),
            }))
        ).subscribe({
            next: (response) => {

                this.products.set(response.data);
                this.loading.update(s => ({ ...s, fetching: false }));
            },
            error: () => {
                this.loading.update(s => ({ ...s, fetching: false }));
            },
        })
    }

    /**
     * Sets the search value and trigger the datasource computed
     * @param value : string | null - null means no search. Containes the string to be searched
     */
    public onSearch(value: string | null): void {
        this.search.set(value);
    }
    /**
     * Sets the page size and trigger the datasource computed
     * @param event : Event - Event triggered by the page size select
     */
    public onPageSizeChange(event: Event): void {
        const target = event.target as HTMLSelectElement;
        const pageSize = parseInt(target.value);
        this.pageSize.set(pageSize as 5 | 10 | 20);
    }
    /**
     * Stores the product that has to be deleted and open the confirmation modal
     * @param id : string - Id of the product to be deleted
     */
    public onDelete(id: string): void {
        const product = this.products().find(product => product.id === id);

       this.toDelete.set(product ?? null);
    }
    /**
     * Closes the confirmation modal
     */
    public onCancelDelete(): void {
        this.toDelete.set(null);
    }
    /**
     * Deletes the product and manage the loading deleting status
     */
    public onConfirmDelete(): void {
        if (!this.toDelete()) return
        this.loading.update(s => {
            s.deleting.add(this.toDelete()!.id);
            return s;
        });
        this.productService.delete(this.toDelete()!.id).subscribe({
            next: () => {

                this.getProducts();
                this.loading.update(s => {
                    s.deleting.delete(this.toDelete()!.id);
                    return s;
                });

                this.toast.open('success', this.translateService.instant('product.deleted', {
                    value: this.toDelete()?.name
                }))

                this.toDelete.set(null);
            },
            error: (error: HttpErrorResponse) => {
                this.loading.update(s => {
                    s.deleting.delete(this.toDelete()!.id);
                    return s;
                });

                 if (error.status === 404) {
                    this.toast.open('error', this.translateService.instant('errors.not_found.product', { value: this.toDelete()?.id }));
                    return
                }

                this.toast.open('error', this.translateService.instant('errors.server_error'))
            }
        })

    }

}
