// src/app/features/invoices/invoices-list.component.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { InvoicesService } from '../../core/services/invoices.service';
import { InvoiceListItem } from '../../core/models/invoice.models';

dayjs.extend(utc);

@Component({
  standalone: true,
  selector: 'app-invoices-list',
  imports: [CommonModule, FormsModule, TableModule, SelectModule, DatePickerModule, ButtonModule],
  template: `
  <div class="p-3">
    <div class="flex gap-2 items-center mb-3">
      <p-select [options]="['','TRY','USD','EUR']" [(ngModel)]="currency" placeholder="Para Birimi" class="w-10rem"></p-select>
      <p-datepicker [(ngModel)]="dateFrom" dateFormat="yy-mm-dd" placeholder="Başlangıç"></p-datepicker>
      <p-datepicker [(ngModel)]="dateTo" dateFormat="yy-mm-dd" placeholder="Bitiş"></p-datepicker>
      <button pButton label="Filtrele" (click)="load()"></button>
    </div>

    <p-table
      [value]="rows()"
      [lazy]="true"
      [loading]="loading()"
      [paginator]="true"
      [rows]="pageSize"
      [totalRecords]="total()"
      (onPage)="onPage($event)"
      (onSort)="onSort($event)"
      [sortField]="currentSortField"
      [sortOrder]="currentSortOrder"
      [sortMode]="'single'"> 
      <ng-template pTemplate="header">
        <tr>
          <th pSortableColumn="dateUtc">Tarih <p-sortIcon field="dateUtc"/></th>
          <th>Para Birimi</th>
          <th>Net</th>
          <th>KDV</th>
          <th pSortableColumn="totalGross">Genel Toplam <p-sortIcon field="totalGross"/></th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-r>
        <tr>
          <td>{{ r.dateUtc | date:'yyyy-MM-dd HH:mm' }}</td>
          <td>{{ r.currency }}</td>
          <td>{{ r.totalNet }}</td>
          <td>{{ r.totalVat }}</td>
          <td>{{ r.totalGross }}</td>
        </tr>
      </ng-template>
    </p-table>
  </div>
  `
})
export class InvoicesListComponent {
  rows = signal<InvoiceListItem[]>([]);
  total = signal(0);
  loading = signal(false);

  private readonly allowedSortFields = new Set(['dateUtc', 'totalGross']);

  pageNumber = 1;
  pageSize = 20;
  sort = 'dateUtc:desc';
  currentSortField: string = 'dateUtc';
  currentSortOrder: 1 | 0 | -1 = -1; // 1=asc, -1=desc

  currency = '';
  dateFrom?: Date;
  dateTo?: Date;

  constructor(private api: InvoicesService) { this.load(); }

  private iso(d?: Date) { return d ? dayjs(d).utc().startOf('day').toISOString() : undefined; }

  load() {
    this.loading.set(true);
    this.api.list({
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      sort: this.sort,
      currency: this.currency || undefined,
      dateFromUtc: this.iso(this.dateFrom),
      dateToUtc: this.iso(this.dateTo)
    }).subscribe({
      next: r => { this.rows.set(r.items); this.total.set(r.total); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  onPage(e: any) {
    this.pageNumber = (e.page ?? 0) + 1;
    this.pageSize = e.rows;
    this.load();
  }

  onSort(e: any) {
    const field = e?.sortField ?? e?.field;
    const order = e?.sortOrder ?? e?.order; // 1 | -1
    if (!field || order === undefined || order === null) return;

    if (!this.allowedSortFields.has(field)) {
      // İzin verilmeyen kolona tıklanırsa yok say (opsiyonel: toast göster)
      return;
    }

    this.currentSortField = field;
    this.currentSortOrder = order as 1 | -1;

    this.sort = `${field}:${order === 1 ? 'asc' : 'desc'}`;
    this.pageNumber = 1;
    this.load();
  }
}
