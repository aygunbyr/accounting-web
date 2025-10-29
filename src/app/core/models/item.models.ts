export interface ItemListItem {
  id: number;
  name: string;
  unit: string;
  vatRate: number;
  defaultUnitPrice?: string | null; // BE -> Money.S2 string
  createdAtUtc: string;
}

export interface ListItemsQuery {
  pageNumber?: number;
  pageSize?: number;
  sort?: string;        // "name:asc|desc", "vatrate:asc|desc", "price:asc|desc"
  search?: string | null;
  unit?: string | null;
  vatRate?: number | null;
}
