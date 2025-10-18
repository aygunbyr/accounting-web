export interface InvoiceListItem {
  id: number;
  dateUtc: string;
  currency: string;
  totalNet: string;
  totalVat: string;
  totalGross: string;
  contactId?: number | null;
  createdAtUtc: string;
}
export interface ListInvoicesQuery {
  pageNumber?: number;
  pageSize?: number;
  sort?: string;                // "dateUtc:desc"
  contactId?: number;
  currency?: string;
  dateFromUtc?: string;
  dateToUtc?: string;
  type?: string;                // satış/satınalma gibi enum ise string bırakıyoruz
}
