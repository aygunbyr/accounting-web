import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BranchDto } from '../models/branch.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BranchesService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiBaseUrl}/branches`;

  list(): Observable<BranchDto[]> {
    return this.http.get<BranchDto[]>(`${this.baseUrl}`);
  }
}
