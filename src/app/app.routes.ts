import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'products',
        loadComponent: () =>
            import(
                './features/products/products-list/products-list.component'
            ).then((c) => c.ProductsListComponent),
    },
    {
        path: 'products/details',
        loadComponent: () =>
            import(
                './features/products/products-details/products-details.component'
            ).then((c) => c.ProductsDetailsComponent),
    },
    {
        path: 'products/details/:id',
        loadComponent: () =>
            import(
                './features/products/products-details/products-details.component'
            ).then((c) => c.ProductsDetailsComponent),
    },
    {
        path: '**',
        redirectTo: 'products',
    },
    {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full',
    },
];
