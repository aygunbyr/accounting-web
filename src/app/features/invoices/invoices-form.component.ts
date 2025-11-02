import { Component, Input, Output, EventEmitter, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormBuilder, ReactiveFormsModule,
    Validators, FormArray, FormControl, FormGroup
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export type InvoiceMode = 'insert' | 'update' | 'view';
export type InvoiceTypeStr = 'Sales' | 'Purchase' | 'SalesReturn' | 'PurchaseReturn';

export interface EditLine {
    id?: number;
    itemId: number | null;
    itemCode?: string | null;
    itemName?: string | null;
    unit?: string | null;
    qty: number | null;
    unitPrice: number | null;
    vatRate: number | null;
    net?: string | null; vat?: string | null; gross?: string | null;
}

export interface InvoiceFormValue {
    id?: number;
    rowVersionBase64?: string;
    contactId: number | null;
    dateUtc: string;
    currency: string;
    type: InvoiceTypeStr;
    lines: EditLine[];
}

/** --- Tipli Line Form --- */
type LineForm = {
    id: FormControl<number>;
    itemId: FormControl<number | null>;
    itemCode: FormControl<string | null>;
    itemName: FormControl<string | null>;
    unit: FormControl<string | null>;
    qty: FormControl<number | null>;
    unitPrice: FormControl<number | null>;
    vatRate: FormControl<number | null>;
    net: FormControl<string | null>;
    vat: FormControl<string | null>;
    gross: FormControl<string | null>;
};

/** --- Tipli Ana Form --- */
type InvoiceFormGroup = FormGroup<{
    rowVersionBase64: FormControl<string>;
    contactId: FormControl<number | null>;
    dateUtc: FormControl<string>;
    currency: FormControl<string>;
    type: FormControl<InvoiceTypeStr>;
    lines: FormArray<FormGroup<LineForm>>;
}>;

@Component({
    standalone: true,
    selector: 'app-invoice-form',
    imports: [
        CommonModule, ReactiveFormsModule,
        MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule
    ],
    template: `
  <form class="page" [formGroup]="form" (ngSubmit)="onSave()">
    <div class="toolbar">
      <h2 class="title">
        {{ mode === 'insert' ? 'Yeni Fatura' :
           mode === 'update' ? 'Fatura Düzenle' : 'Fatura' }}
      </h2>
      <span class="spacer"></span>
      <button *ngIf="mode!=='view'" mat-flat-button color="primary" type="submit">
        <mat-icon>save</mat-icon>
        Kaydet
      </button>
    </div>

    <div class="form-grid">
      <mat-form-field appearance="outline">
        <mat-label>Cari (ID)</mat-label>
        <input matInput type="number" formControlName="contactId" placeholder="örn: 1">
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Tarih (UTC)</mat-label>
        <input matInput type="datetime-local" formControlName="dateUtc">
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Para Birimi</mat-label>
        <mat-select formControlName="currency">
          <mat-option value="TRY">TRY</mat-option>
          <mat-option value="USD">USD</mat-option>
          <mat-option value="EUR">EUR</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Tür</mat-label>
        <mat-select formControlName="type">
          <mat-option value="Sales">Sales</mat-option>
          <mat-option value="Purchase">Purchase</mat-option>
          <mat-option value="SalesReturn">SalesReturn</mat-option>
          <mat-option value="PurchaseReturn">PurchaseReturn</mat-option>
        </mat-select>
      </mat-form-field>
    </div>

    <div class="lines">
      <div class="lines-head">
        <h3>Satırlar ({{ lineArray().length }})</h3>
        <span class="spacer"></span>
        <button *ngIf="mode!=='view'" type="button" mat-stroked-button (click)="addLine()">
          <mat-icon>add</mat-icon> Satır Ekle
        </button>
      </div>

      <div class="line" *ngFor="let g of lineArray().controls; let i = index" [formGroup]="g">
        <mat-form-field appearance="outline">
          <mat-label>Item ID</mat-label>
          <input matInput type="number" formControlName="itemId">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Miktar</mat-label>
          <input matInput type="number" formControlName="qty">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Birim Fiyat</mat-label>
          <input matInput type="number" formControlName="unitPrice">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>KDV (%)</mat-label>
          <input matInput type="number" formControlName="vatRate">
        </mat-form-field>

        <button *ngIf="mode!=='view'" type="button" mat-icon-button color="warn" (click)="removeLine(i)">
          <mat-icon>delete</mat-icon>
        </button>
      </div>
    </div>

    <div class="foot" *ngIf="mode!=='view'">
      <span class="spacer"></span>
      <button mat-flat-button color="primary" type="submit">
        <mat-icon>save</mat-icon> Kaydet
      </button>
    </div>
  </form>
  `,
    styles: [`
    .page { display:flex; flex-direction:column; gap:16px; }
    .toolbar, .lines-head, .foot { display:flex; align-items:center; gap:12px; }
    .title { margin:0; font-weight:600; }
    .spacer { flex:1; }
    .form-grid {
      display:grid; gap:12px;
      grid-template-columns: repeat(4, minmax(180px, 1fr));
    }
    .lines { display:flex; flex-direction:column; gap:12px; }
    .line {
      display:grid; gap:12px; align-items:center;
      grid-template-columns: repeat(4, minmax(140px, 1fr)) 40px;
    }
    @media (max-width: 900px) {
      .form-grid { grid-template-columns: repeat(2, 1fr); }
      .line { grid-template-columns: repeat(2, 1fr) 40px; }
    }
  `]
})
export class InvoiceFormComponent {
    @Input() mode: InvoiceMode = 'insert';

    @Input() set value(v: InvoiceFormValue | null) {
        if (!v) return;

        // header patch (tipler birebir uyumlu)
        this.form.patchValue({
            rowVersionBase64: v.rowVersionBase64 ?? '',
            contactId: v.contactId ?? null,
            dateUtc: v.dateUtc ?? new Date().toISOString(),
            currency: v.currency ?? 'TRY',
            type: (v.type ?? 'Sales') as InvoiceTypeStr
        }, { emitEvent: false });

        // lines patch
        const fa = this.form.controls.lines;
        fa.clear({ emitEvent: false });
        (v.lines ?? []).forEach((l: EditLine) => {
            fa.push(this.lineGroupFromEdit(l), { emitEvent: false });
        });
    }

    @Output() saveInsert = new EventEmitter<Omit<InvoiceFormValue, 'rowVersionBase64' | 'id'>>();
    @Output() saveUpdate = new EventEmitter<InvoiceFormValue>();

    // ✅ FormBuilder güvenle kullanılabilir
    private fb = inject(FormBuilder);

    // ✅ Tipli form
    form: InvoiceFormGroup = this.fb.group({
        rowVersionBase64: this.fb.nonNullable.control<string>(''),
        contactId: this.fb.control<number | null>(null, { validators: [Validators.required] }),
        dateUtc: this.fb.nonNullable.control<string>(new Date().toISOString(), { validators: [Validators.required] }),
        currency: this.fb.nonNullable.control<string>('TRY', { validators: [Validators.required] }),
        type: this.fb.nonNullable.control<InvoiceTypeStr>('Sales', { validators: [Validators.required] }),
        lines: this.fb.array<FormGroup<LineForm>>([])
    });

    readonly = computed(() => this.mode === 'view');

    // ✅ Tipli erişim
    lineArray(): FormArray<FormGroup<LineForm>> {
        return this.form.controls.lines;
    }

    // ✅ Tek noktadan line group üretimi
    private lineGroupFromEdit(l?: EditLine): FormGroup<LineForm> {
        return this.fb.group<LineForm>({
            id: this.fb.nonNullable.control<number>(l?.id ?? 0),
            itemId: this.fb.control<number | null>(l?.itemId ?? null, { validators: [Validators.required] }),
            itemCode: this.fb.control<string | null>(l?.itemCode ?? null),
            itemName: this.fb.control<string | null>(l?.itemName ?? null),
            unit: this.fb.control<string | null>(l?.unit ?? null),
            qty: this.fb.control<number | null>(l?.qty ?? null, { validators: [Validators.min(0)] }),
            unitPrice: this.fb.control<number | null>(l?.unitPrice ?? null, { validators: [Validators.min(0)] }),
            vatRate: this.fb.control<number | null>(l?.vatRate ?? 0, { validators: [Validators.min(0), Validators.max(100)] }),
            net: this.fb.control<string | null>(l?.net ?? null),
            vat: this.fb.control<string | null>(l?.vat ?? null),
            gross: this.fb.control<string | null>(l?.gross ?? null),
        });
    }

    addLine() {
        if (this.readonly()) return;
        this.lineArray().insert(0, this.lineGroupFromEdit({
            id: 0, itemId: null, itemCode: null, itemName: null, unit: null,
            qty: 1, unitPrice: 0, vatRate: 20, net: null, vat: null, gross: null
        }));
    }

    removeLine(i: number) {
        if (this.readonly()) return;
        this.lineArray().removeAt(i);
    }

    onSave() {
        if (this.readonly()) return;

        // Satırları grup üzerinden alın; getRawValue().lines plain object döndürür ve .controls yok!
        const bodyLines = this.lineArray().controls.map(g => {
            const v = g.getRawValue(); // v: { id: number, itemId: number|null, ... }
            return {
                id: v.id,                                      // ✅ number
                itemId: v.itemId!,                             // required
                qty: Number(v.qty ?? 0),
                unitPrice: Number(v.unitPrice ?? 0),
                vatRate: Number(v.vatRate ?? 0),
            };
        });

        const hv = this.form.getRawValue(); // header

        if (this.mode === 'insert') {
            this.saveInsert.emit({
                contactId: hv.contactId!,
                dateUtc: hv.dateUtc,
                currency: hv.currency,
                type: hv.type,
                lines: bodyLines
            });
        } else {
            this.saveUpdate.emit({
                id: (this as any).id, // container set ediyor
                rowVersionBase64: hv.rowVersionBase64,        // ✅ string
                contactId: hv.contactId!,
                dateUtc: hv.dateUtc,
                currency: hv.currency,
                type: hv.type,
                lines: bodyLines
            });
        }
    }
}
