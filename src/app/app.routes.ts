import { Routes } from '@angular/router';

// src/app/app.routes.ts
export const routes: Routes = [
  { path: '', redirectTo: 'payments', pathMatch: 'full' },
  {
    path: 'payments',
    loadComponent: () => import('./features/payments/payments-list.component')
      .then(m => m.PaymentsListComponent)
  },
  {
    path: 'invoices',
    loadComponent: () => import('./features/invoices/invoices-list.component')
      .then(m => m.InvoicesListComponent)
  }
];
