import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProductsService } from '@products/apis/products/products.service';
import { ItemMenuComponent } from '@products/components/item-menu/item-menu.component';
import { Product } from '@products/models/product.model';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { SearchFieldComponent } from '@shared/ui/search-field/search-field.component';
import { map } from 'rxjs';

@Component({
    selector: 'app-products-list',
    imports: [SearchFieldComponent, TranslateModule, RouterModule, ButtonComponent, ItemMenuComponent],
    templateUrl: './products-list.component.html',
    styleUrl: './products-list.component.scss',
})
export class ProductsListComponent implements OnInit {

    public loading = signal({ fetching: false, deleting: new Set<string>() });
    public productService = inject(ProductsService);
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
    protected products = signal<Product[]>([]);
    protected pageSize = signal<5 | 10 | 20>(5);
    protected search = signal<string | null>(null);

    protected openMenus = signal<Set<string>>(new Set());

    protected toDelete = signal<Product | null>(null);

    ngOnInit(): void {
        this.getProducts();
    }

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

    public onSearch(value: string | null): void {
        this.search.set(value);
    }

    public onPageSizeChange(event: Event): void {
        const target = event.target as HTMLSelectElement;
        const pageSize = parseInt(target.value);
        console.log('🚀 ~ ProductsListComponent ~ onPageSizeChange ~ pageSize:', pageSize)
        this.pageSize.set(pageSize as 5 | 10 | 20);
    }

    public toggleMenu(id: string): void {

        if (this.openMenus().has(id)) {
            this.openMenus.update(s => {
                s.delete(id);
                return s;
            });
        } else {
            this.openMenus.update(s => {
                s.add(id);
                return s;
            });
        }
    }

    public onDelete(id: string): void {
        const product = this.products().find(product => product.id === id);

       this.toDelete.set(product ?? null);
    }

    public onCancelDelete(): void {
        this.toDelete.set(null);
    }

    public onConfirmDelete(): void {
        if (!this.toDelete()) return
        this.loading.update(s => {
            s.deleting.add(this.toDelete()!.id);
            return s;
        });
        this.productService.delete(this.toDelete()!.id).subscribe({
            next: () => {
                this.toDelete.set(null);
                this.getProducts();
                this.loading.update(s => {
                    s.deleting.delete(this.toDelete()!.id);
                    return s;
                });
            },
            error: () => {
                this.loading.update(s => {
                    s.deleting.delete(this.toDelete()!.id);
                    return s;
                });
            }
        })

    }

}
