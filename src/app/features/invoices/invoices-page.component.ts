import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColDef } from 'ag-grid-community';
import { ListGridComponent } from '../../shared/list-grid/list-grid.component';
import { InvoicesService } from '../../core/services/invoices.service';
import { InvoiceListItem } from '../../core/models/invoice.models';
import { MatIconModule } from '@angular/material/icon';
import { InvoiceActionsCell } from './invoice-actions.cell';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-invoices-page',
  imports: [CommonModule, MatIconModule, MatButtonModule, RouterModule, ListGridComponent],
  template: `
    <div class="toolbar">
      <span class="spacer"></span>
      <a mat-stroked-button color="primary" routerLink="/invoices/new">
        <mat-icon>add</mat-icon>
        Yeni Fatura
      </a>
    </div>

    <app-list-grid
      title="Faturalar"
      [columns]="colDefs"
      [sortWhitelist]="sortWhitelist"
      [fetcher]="fetcher">
    </app-list-grid>
  `,
  styles: [`
    .toolbar{display:flex;align-items:center;margin-bottom:8px}
    .title{font-weight:600}
    .spacer{flex:1}
    :host ::ng-deep .icon-btn{
      display:inline-flex;align-items:center;justify-content:center;
      width:32px;height:32px;border-radius:6px;text-decoration:none;
      margin-left:4px;
    }
    :host ::ng-deep .icon-btn .material-icons{font-size:20px;line-height:20px}
  `]
})
export class InvoicesPageComponent {
  sortWhitelist = ['dateUtc','totalNet','totalVat','totalGross'];

  colDefs: ColDef<InvoiceListItem>[] = [
    { field: 'dateUtc', headerName: 'Tarih (UTC)', sortable: true, valueFormatter: p => p.value ? new Date(p.value).toLocaleDateString() : '' },
    { field: 'contactCode', headerName: 'Cari Kodu', sortable: false, minWidth: 120 },
    { field: 'contactName', headerName: 'Cari Adı',  sortable: false, minWidth: 180 },
    { field: 'type', headerName: 'Tür', sortable: false, maxWidth: 120 }, // Sales/Purchase    
    { field: 'currency', headerName: 'PB', sortable: false, maxWidth: 100 },
    { field: 'totalNet', headerName: 'Net', sortable: true, type: 'rightAligned', minWidth: 120 },
    { field: 'totalVat', headerName: 'KDV', sortable: true, type: 'rightAligned', minWidth: 120 },
    { field: 'totalGross', headerName: 'Genel Toplam', sortable: true, type: 'rightAligned', minWidth: 140 },
    // 🔽 Aksiyonlar
    {
    headerName: '',
    field: 'id',
    width: 110,
    pinned: 'right',
    sortable: false,
    filter: false,
    suppressHeaderMenuButton: true,   // ✅ v34
    cellRenderer: InvoiceActionsCell   // (Angular renderer’ı kullanıyoruz)
  }
  ];

  constructor(private service: InvoicesService) {}

  // fetcher fonksiyonu Input olarak veriyoruz
  fetcher = (q: { pageNumber?: number; pageSize?: number; sort?: string; }) =>
    this.service.list(q);
}
