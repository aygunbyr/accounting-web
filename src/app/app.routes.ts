import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'invoices' },

  { path: 'payments', loadComponent: () => import('./features/payments/payments-page.component').then(m => m.PaymentsPageComponent) },
  { path: 'items',    loadComponent: () => import('./features/items/items-page.component').then(m => m.ItemsPageComponent) },
  { path: 'fixed-assets', loadComponent: () => import('./features/fixed-assets/fixed-assets-page.component').then(m => m.FixedAssetsPageComponent) },

  // ---- Invoices (özeller önce) ----
  { path: 'invoices/new',        loadComponent: () => import('./features/invoices/invoice-edit.page').then(m => m.InvoicesEditPage) }, // INSERT
  { path: 'invoices/:id/edit',   loadComponent: () => import('./features/invoices/invoice-edit.page').then(m => m.InvoicesEditPage) }, // UPDATE
  { path: 'invoices/:id',        loadComponent: () => import('./features/invoices/invoice-edit.page').then(m => m.InvoicesEditPage) }, // VIEW
  { path: 'invoices',            loadComponent: () => import('./features/invoices/invoices-page.component').then(m => m.InvoicesPageComponent) }, // LIST

  { path: '**', redirectTo: 'invoices' }
];
