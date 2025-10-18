import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { PagedResult } from "../models/paged-result";
import { ListPaymentsQuery, PaymentDetail, PaymentListItem } from "../models/payment.models";

@Injectable({ providedIn: 'root' })
export class PaymentsService {
    private base = `${environment.apiBaseUrl}/payments`;

    constructor(private http: HttpClient) { }

    list(q: ListPaymentsQuery) {
        let params = new HttpParams();
        Object.entries(q).forEach(([k, v]) => {
            if (v !== undefined && v !== null && v !== '') params = params.set(k, String(v));
        });
        return this.http.get<PagedResult<PaymentListItem>>(this.base, { params });
    }

    getById(id: number) {
        return this.http.get<PaymentDetail>(`${this.base}/${id}`);
    }

    create(body: {
        accountId: number;
        contactId?: number | null;
        linkedInvoiceId?: number | null;
        dateUtc: string;
        direction: 'In' | 'Out';
        amount: string;
        currency: string;
    }) {
        return this.http.post<{ id: number }>(this.base, body);
    }

    softDelete(id: number, rowVersion: string) {
        return this.http.delete(`${this.base}/${id}`, { body: { rowVersion } })
    }
}
