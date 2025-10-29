import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { PagedResult } from '../models/paged-result';
import { ItemListItem, ListItemsQuery } from '../models/item.models';

@Injectable({ providedIn: 'root' })
export class ItemsService {
  private base = `${environment.apiBaseUrl}/items`;
  constructor(private http: HttpClient) {}

  list(q: ListItemsQuery) {
    const params: Record<string, string> = {};
    Object.entries(q).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') params[k] = String(v);
    });
    return this.http.get<PagedResult<ItemListItem>>(this.base, { params });
  }
}
