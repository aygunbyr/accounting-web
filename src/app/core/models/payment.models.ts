export enum PaymentDirectionFilter {
  Any = 0,
  In = 1,
  Out = 2
}

export interface PaymentListItem {
  id: number;
  accountId: number;
  accountCode: string;
  accountName: string;
  contactId?: number | null;
  contactCode?: string | null;
  contactName?: string | null;
  linkedInvoiceId?: number | null;
  dateUtc: string;
  direction: string;
  amount: string;
  currency: string;
  createdAtUtc: string;
}

export interface PaymentDetail extends PaymentListItem {
  rowVersion: string;
  updatedAtUtc?: string | null;
}

export interface ListPaymentsQuery {
  pageNumber?: number;
  pageSize?: number;
  sort?: string;
  direction?: PaymentDirectionFilter;
  accountId?: number;
  contactId?: number;
  dateFromUtc?: string;
  dateToUtc?: string;
  currency?: string;
}
