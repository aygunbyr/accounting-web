import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColDef } from 'ag-grid-community';
import { ListGridComponent } from '../../shared/list-grid/list-grid.component';
import { InvoicesService } from '../../core/services/invoices.service';
import { InvoiceListItem } from '../../core/models/invoice.models';
import { MatIconModule } from '@angular/material/icon';
import { InvoiceActionsCell } from './invoice-actions.cell';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BranchDto } from '../../core/models/branch.models';
import { BranchesService } from '../../core/services/branches.service';

@Component({
  standalone: true,
  selector: 'app-invoices-page',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ListGridComponent
  ],
  template: `
    <span class="title">Filtreler</span>
    
    <div class="toolbar">
      <div class="filters">
      <mat-form-field appearance="outline" class="branch-field">
        <mat-label>Şube</mat-label>
        <mat-select [(ngModel)]="branchId">
          <mat-option [value]="null">Tüm şubeler</mat-option>
          <mat-option *ngFor="let b of branches" [value]="b.id">
            {{ b.code }} - {{ b.name }}
          </mat-option>
        </mat-select>
      </mat-form-field>

      <button mat-stroked-button (click)="apply()">Uygula</button>
      <button mat-button (click)="reset()">Sıfırla</button>
    </div>
      <span class="spacer"></span>
      <a mat-stroked-button color="primary" routerLink="/invoices/new">
        <mat-icon>add</mat-icon>
        Yeni Fatura
      </a>
    </div>

    <app-list-grid
      #grid
      title="Faturalar"
      [columns]="colDefs"
      [sortWhitelist]="sortWhitelist"
      [fetcher]="fetcher">
    </app-list-grid>
  `,
  styles: [`
    .toolbar { display:flex; align-items:center; padding:8px 0; }
    .title { font-weight:600; }
    .spacer { flex:1; }
    .filters { display:flex; flex-wrap:wrap; gap:12px; align-items:center; }
    :host ::ng-deep .icon-btn{
      display:inline-flex;align-items:center;justify-content:center;
      width:32px;height:32px;border-radius:6px;text-decoration:none;
      margin-left:4px;
    }
    :host ::ng-deep .icon-btn .material-icons{font-size:20px;line-height:20px}
    .branch-field { min-width: 260px; }
  `]
})
export class InvoicesPageComponent {
  sortWhitelist = ['dateUtc', 'totalNet', 'totalVat', 'totalGross'];
  branchId: number | null = null;
  branches: BranchDto[] = [];

  colDefs: ColDef<InvoiceListItem>[] = [
    { field: 'dateUtc', headerName: 'Tarih (UTC)', sortable: true, valueFormatter: p => p.value ? new Date(p.value).toLocaleDateString() : '' },
    { field: 'branchId', headerName: 'Şube Id', sortable: false, minWidth: 80 },
    { field: 'branchCode', headerName: 'Şube Kodu', sortable: false, minWidth: 80 },
    { field: 'branchName', headerName: 'Şube Adı', sortable: false, minWidth: 120 },
    { field: 'contactCode', headerName: 'Cari Kodu', sortable: false, minWidth: 80 },
    { field: 'contactName', headerName: 'Cari Adı', sortable: false, minWidth: 180 },
    { field: 'type', headerName: 'Tür', sortable: false, maxWidth: 120 }, // Sales/Purchase    
    { field: 'currency', headerName: 'Para Brm', sortable: false, maxWidth: 100 },
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

  @ViewChild('grid') grid!: ListGridComponent<InvoiceListItem>;

  constructor(
    private service: InvoicesService,
    private branchesService: BranchesService,
  ) {
    this.branchesService.list().subscribe({
      next: (res) => (this.branches = res),
      error: () => {
        this.branches = [];
      }
    });
  }

  // fetcher fonksiyonu Input olarak veriyoruz
  fetcher = (q: { pageNumber?: number; pageSize?: number; sort?: string; }) => {
    const query = {
      ...q,
      branchId: this.branchId ?? undefined
    };
    return this.service.list(query);
  }

  apply() {
    this.grid.reload();
  }

  reset() {
    this.branchId = null;
    this.grid.reload();
  }


}
