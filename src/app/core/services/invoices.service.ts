import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { PagedResult } from "../models/paged-result";
import { InvoiceListItem, ListInvoicesQuery } from "../models/invoice.models";

@Injectable({ providedIn: 'root' })
export class InvoicesService {
    private base = `${environment.apiBaseUrl}/invoices`;
    constructor(private http: HttpClient) { }

    list(q: ListInvoicesQuery) {
        let params = new HttpParams();
        Object.entries(q).forEach(([k, v]) => {
            if (v !== undefined && v !== null && v !== '')
                params = params.set(k, String(v));
        });
        return this.http.get<PagedResult<InvoiceListItem>>(this.base, { params });
    }
}
