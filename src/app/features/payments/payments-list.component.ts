import { Component, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { PaymentsService } from '../../core/services/payments.service';
import { PaymentDirectionFilter, PaymentListItem } from '../../core/models/payment.models';

dayjs.extend(utc);

@Component({
    standalone: true,
    selector: 'app-payments-list',
    imports: [CommonModule, TableModule, PaginatorModule, SelectModule, ButtonModule, DialogModule, InputNumberModule, DatePickerModule, FormsModule],
    templateUrl: './payments-list.component.html'
})
export class PaymentsListComponent {
    rows = signal<PaymentListItem[]>([]);
    total = signal(0);
    loading = signal(false);

    private readonly allowedSortFields = new Set(['dateUtc', 'amount']);

    // state
    pageNumber = 1;
    pageSize = 20;
    sort = 'dateUtc:desc';

    currentSortField: string = 'dateUtc';
    currentSortOrder: 1 | 0 | -1 = -1; // 1=asc, -1=desc

    // filters
    direction: PaymentDirectionFilter = PaymentDirectionFilter.Any;
    directionOptions = [
        { label: 'Tümü', value: PaymentDirectionFilter.Any },
        { label: 'Tahsilat', value: PaymentDirectionFilter.In },
        { label: 'Tediye', value: PaymentDirectionFilter.Out },
    ];
    currency = '';
    dateFrom?: Date;
    dateTo?: Date;

    // create dialog
    showCreate = false;
    createModel = {
        accountId: 1,
        contactId: null as number | null,
        linkedInvoiceId: null as number | null,
        // dateUtc: dayjs().utc().toISOString(),
        direction: 'In' as 'In' | 'Out',
        amount: '',
        currency: 'TRY'
    };

    createModelDate: Date = new Date();

    constructor(private api: PaymentsService) {
        this.load();
    }

    private iso(d?: Date) {
        return d ? dayjs(d).utc().startOf('day').toISOString() : undefined;
    }

    load() {
        this.loading.set(true);
        this.api.list({
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
            sort: this.sort,
            direction: this.direction === PaymentDirectionFilter.Any ? undefined : this.direction,
            currency: this.currency || undefined,
            dateFromUtc: this.iso(this.dateFrom),
            dateToUtc: this.iso(this.dateTo)
        }).subscribe({
            next: res => {
                this.rows.set(res.items);
                this.total.set(res.total);
                this.loading.set(false);
            },
            error: _ => this.loading.set(false)
        });
    }

    onPage(e: any) {
        this.pageNumber = (e.page ?? 0) + 1;
        this.pageSize = e.rows;
        this.load();
    }

    onSort(e: any) {
        const field = e?.sortField ?? e?.field;
        const order = e?.sortOrder ?? e?.order;
        if (!field || order === undefined || order === null) return;

        // BE'nin kabul etmediği bir field geldiyse yok say
        if (!this.allowedSortFields.has(field)) {
            // isteğe bağlı: kullanıcıya küçük bir uyarı da gösterebilirsin
            return;
        }

        this.currentSortField = field;
        this.currentSortOrder = order as 1 | -1;
        this.sort = `${field}:${order === 1 ? 'asc' : 'desc'}`;
        this.pageNumber = 1;
        this.load();
    }

    create() {
        const payload = {
            ...this.createModel,
            dateUtc: dayjs(this.createModelDate).utc().toISOString()
        };
        this.api.create(payload).subscribe({
            next: _ => { this.showCreate = false; this.load(); },
            error: _ => { }
        });
    }

    confirmSoftDelete(r: PaymentListItem) {
        // BE kontratında RowVersion gerekli ise önce getById ile alalım:
        this.api.getById(r.id).subscribe(d => {
            const ok = confirm('Bu ödemeyi yumuşak silmek istiyor musun?');
            if (!ok) return;
            this.api.softDelete(d.id, d.rowVersion).subscribe({
                next: () => this.load()
            });
        });
    }

    directionText(v: string) {
        // BE listesinde direction alanı string geliyor: "In" | "Out"
        return v === 'In' ? 'Tahsilat'
            : v === 'Out' ? 'Tediye'
                : v ?? '-';
    }


}