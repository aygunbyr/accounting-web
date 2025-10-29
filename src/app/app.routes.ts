import { Routes } from '@angular/router';

// src/app/app.routes.ts
export const routes: Routes = [
  { path: '', redirectTo: 'payments', pathMatch: 'full' },
  { path: 'payments', loadComponent: () => import('./features/payments/payments-page.component').then(m => m.PaymentsPageComponent) },
  { path: 'invoices', loadComponent: () => import('./features/invoices/invoices-page.component').then(m => m.InvoicesPageComponent) },
  { path: 'items', loadComponent: () => import('./features/items/items-page.component').then(m => m.ItemsPageComponent) },

];
