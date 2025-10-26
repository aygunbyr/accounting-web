import { Routes } from '@angular/router';

// src/app/app.routes.ts
export const routes: Routes = [
  { path: '', redirectTo: 'payments', pathMatch: 'full' },
  {
    path: 'payments',
    loadComponent: () => import('./features/payments/payments-grid.component')
      .then(m => m.PaymentsGridComponent)
  },
  // {
  //   path: 'invoices',
  //   loadComponent: () => import('./features/invoices/invoices-list.component')
  //     .then(m => m.InvoicesListComponent)
  // }
];
