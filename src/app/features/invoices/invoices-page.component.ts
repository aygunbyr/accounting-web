import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColDef } from 'ag-grid-community';
import { ListGridComponent } from '../../shared/list-grid/list-grid.component';
import { InvoicesService } from '../../core/services/invoices.service';
import { InvoiceListItem } from '../../core/models/invoice.models';

@Component({
  standalone: true,
  selector: 'app-invoices-page',
  imports: [CommonModule, ListGridComponent],
  template: `
    <app-list-grid
      title="Faturalar"
      [columns]="colDefs"
      [sortWhitelist]="sortWhitelist"
      [fetcher]="fetcher">
    </app-list-grid>
  `
})
export class InvoicesPageComponent {
  sortWhitelist = ['dateUtc','totalNet','totalVat','totalGross'];

  colDefs: ColDef<InvoiceListItem>[] = [
    { field: 'dateUtc', headerName: 'Tarih (UTC)', sortable: true, valueFormatter: p => p.value ? new Date(p.value).toLocaleDateString() : '' },
    { field: 'contactId', headerName: 'Cari (Id)', sortable: false, minWidth: 140 },
    { field: 'totalNet', headerName: 'Net', sortable: true, type: 'rightAligned', minWidth: 120 },
    { field: 'totalVat', headerName: 'KDV', sortable: true, type: 'rightAligned', minWidth: 120 },
    { field: 'totalGross', headerName: 'Genel Toplam', sortable: true, type: 'rightAligned', minWidth: 140 },
    { field: 'currency', headerName: 'PB', sortable: false, maxWidth: 100 },
  ];

  constructor(private service: InvoicesService) {}

  // fetcher fonksiyonu Input olarak veriyoruz
  fetcher = (q: { pageNumber?: number; pageSize?: number; sort?: string; }) =>
    this.service.list(q);
}
