export interface InvoiceListItem {
  id: number;
  contactCode: string;
  contactName: string;
  type: string;
  dateUtc: string;
  currency: string;
  totalNet: string;
  totalVat: string;
  totalGross: string;
  contactId?: number | null;
  createdAtUtc: string;
  branchId: number;
  branchCode: string;
  branchName: string;
}

export interface ListInvoicesQuery {
  pageNumber?: number;
  pageSize?: number;
  sort?: string;                // "dateUtc:desc"
  contactId?: number;
  currency?: string;
  dateFromUtc?: string;
  dateToUtc?: string;
  type?: string;                // satış/satınalma gibi
  branchId?: number | null;
}

export interface InvoiceLineDto {
  id: number;
  itemId: number;
  itemCode: string;
  itemName: string;
  unit: string;
  qty: string;       // "S3" string (BE böyle döndürüyor)
  unitPrice: string; // "S4"
  vatRate: number;
  net: string;
  vat: string;
  gross: string;
}

export type InvoiceTypeStr = 'Sales' | 'Purchase' | 'SalesReturn' | 'PurchaseReturn';

export interface InvoiceDto {
  id: number;
  contactId: number;
  contactCode?: string;
  contactName?: string;
  dateUtc: string;
  currency: string;
  type: InvoiceTypeStr;
  totalNet: string;
  totalVat: string;
  totalGross: string;
  lines: InvoiceLineDto[];
  rowVersion: string;
  createdAtUtc: string;
  updatedAtUtc?: string | null;
  branchId: number;
  branchCode: string;
  branchName: string;
}

export interface CreateInvoiceBody {
  branchId: number;
  contactId: number;
  dateUtc: string;
  currency: string;
  type: InvoiceTypeStr;
  lines: Array<{ id?: 0; itemId: number; qty: number; unitPrice: number; vatRate: number }>;
}

export interface CreateInvoiceResult { id: number; rowVersionBase64: string; }

export interface UpdateInvoiceBody {
  id: number;
  rowVersionBase64: string;
  branchId: number;
  contactId: number;
  dateUtc: string;
  currency: string;
  type: InvoiceTypeStr;
  lines: Array<{ id: number; itemId: number; qty: number; unitPrice: number; vatRate: number }>;
}

