import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridReadyEvent, themeQuartz } from 'ag-grid-community';
import { PaymentsService } from '../../core/services/payments.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-payments-grid',
  imports: [CommonModule, AgGridAngular, MatButtonModule],
  template: `
    <div class="toolbar">
      <button mat-stroked-button color="primary" (click)="reload()">Filtrele</button>
    </div>

    <ag-grid-angular
      [theme]="theme"
      [style.height]="gridHeight"
      style="width: 100%"
      [rowData]="rows()"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [suppressMultiSort]="true"
      [pagination]="false"
      (gridReady)="onGridReady($event)"
      (sortChanged)="onSortChanged($event)">
    </ag-grid-angular>

    <div class="pager" style="margin-top: 8px; display: flex; gap: 12px; align-items: center;">
      <button mat-stroked-button (click)="prev()" [disabled]="pageNumber===1">Önceki</button>
      <span>Sayfa {{pageNumber}} / {{totalPages()}}</span>
      <button mat-stroked-button (click)="next()" [disabled]="pageNumber>=totalPages()">Sonraki</button>
    </div>
  `
})
export class PaymentsGridComponent {
  // Theming API (legacy CSS yok)
  theme = themeQuartz.withParams({ spacing: 6, headerHeight: 42, rowHeight: 40 });

  // Manuel grid yüksekliği (istediğin gibi değiştir)
  gridHeight = '80vh';

  rows = signal<any[]>([]);
  total = signal(0);

  pageNumber = 1;
  pageSize = 20;
  sort = 'dateUtc:desc';
  allowedSort = new Set(['dateUtc','amount']);

  columnDefs: ColDef[] = [
    { field: 'dateUtc', headerName: 'Tarih', sortable: true,
      valueFormatter: p => new Date(p.value).toLocaleString() },
    { field: 'direction', headerName: 'Yön', sortable: false,
      valueFormatter: p => p.value === 'In' ? 'Tahsilat' : p.value === 'Out' ? 'Tediye' : '-' },
    { field: 'amount', headerName: 'Tutar', sortable: true },
    { field: 'currency', headerName: 'PB' }
  ];
  defaultColDef: ColDef = { resizable: true, flex: 1, minWidth: 120 };

  constructor(private api: PaymentsService) {}

  onGridReady(_: GridReadyEvent) { this.load(); }

  onSortChanged(e: any) {
    const state = (e.api.getColumnState?.() ?? []) as Array<{ colId: string; sort?: 'asc'|'desc'; sortIndex?: number }>;
    const first = state.filter(s => !!s.sort).sort((a,b) => (a.sortIndex ?? 0) - (b.sortIndex ?? 0))[0];
    if (!first) { this.sort = 'dateUtc:desc'; this.pageNumber = 1; this.load(); return; }
    const field = String(first.colId); if (!this.allowedSort.has(field)) return;
    const dir = first.sort === 'asc' ? 'asc' : 'desc';
    this.sort = `${field}:${dir}`; this.pageNumber = 1; this.load();
  }

  reload(){ this.pageNumber = 1; this.load(); }
  next(){ if (this.pageNumber < this.totalPages()) { this.pageNumber++; this.load(); } }
  prev(){ if (this.pageNumber > 1) { this.pageNumber--; this.load(); } }
  totalPages(){ return Math.max(1, Math.ceil(this.total() / this.pageSize)); }

  private load() {
    this.api.list({ pageNumber: this.pageNumber, pageSize: this.pageSize, sort: this.sort })
      .subscribe(r => { this.rows.set(r.items); this.total.set(r.total); });
  }
}
