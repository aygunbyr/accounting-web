import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { PagedResult } from "../models/paged-result";
import { CreateInvoiceBody, CreateInvoiceResult, InvoiceDto, InvoiceListItem, ListInvoicesQuery, UpdateInvoiceBody } from "../models/invoice.models";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class InvoicesService {
    private baseUrl = `${environment.apiBaseUrl}/invoices`;
    constructor(private http: HttpClient) { }

    list(q: ListInvoicesQuery) {
        let params = new HttpParams();
        Object.entries(q).forEach(([k, v]) => {
            if (v !== undefined && v !== null && v !== '')
                params = params.set(k, String(v));
        });
        return this.http.get<PagedResult<InvoiceListItem>>(this.baseUrl, { params });
    }

    getById(id: number): Observable<InvoiceDto> {
        return this.http.get<InvoiceDto>(`${this.baseUrl}/${id}`);
    }

    create(body: CreateInvoiceBody): Observable<CreateInvoiceResult> {
        return this.http.post<CreateInvoiceResult>(this.baseUrl, body);
    }

    update(body: UpdateInvoiceBody): Observable<InvoiceDto> {
        return this.http.put<InvoiceDto>(`${this.baseUrl}/${body.id}`, body);
    }
}
