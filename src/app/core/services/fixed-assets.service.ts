// src/app/shared/api/fixed-assets-api.service.ts
import { environment } from "../../../environments/environment";
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  FixedAssetListItemDto,
  FixedAssetDetailDto,
  ListFixedAssetsQuery,
  CreateFixedAssetCommand,
  UpdateFixedAssetCommand,
  DeleteFixedAssetCommand
} from '../models/fixed-asset.models';
import { PagedResult } from '../models/paged-result';

@Injectable({
  providedIn: 'root'
})
export class FixedAssetsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/fixedassets`;

  list(query: ListFixedAssetsQuery) {
    return this.http.get<PagedResult<FixedAssetListItemDto>>(this.baseUrl, {
      params: {
        pageNumber: (query.pageNumber ?? 1).toString(),
        pageSize: (query.pageSize ?? 20).toString(),
        search: query.search ?? '',
        includeDeleted: (query.includeDeleted ?? false).toString()
      }
    });
  }

  getById(id: number) {
    return this.http.get<FixedAssetDetailDto>(`${this.baseUrl}/${id}`);
  }

  create(command: CreateFixedAssetCommand) {
    return this.http.post<FixedAssetDetailDto>(this.baseUrl, command);
  }

  update(command: UpdateFixedAssetCommand) {
    return this.http.put<FixedAssetDetailDto>(
      `${this.baseUrl}/${command.id}`,
      command
    );
  }

  softDelete(command: DeleteFixedAssetCommand) {
    return this.http.delete<void>(
      `${this.baseUrl}/${command.id}`,
      {
        body: command
      }
    );
  }
}