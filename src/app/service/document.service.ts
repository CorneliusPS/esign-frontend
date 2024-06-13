import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponseList } from '../interfaces/i-response-list';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { IBarangPost } from '../interfaces/interfaces-barang/i-barang-post';
import { IDocumentPost } from '../interfaces/interface-document/i-document-post';

@Injectable()
export class DocumentService {
  baseUrl = environment.apiBaseUrl;
  keyToken: string = 'token';

  constructor(private http: HttpClient, private authService: AuthService) {}
  getDocumentByUploader(): Observable<IResponseList> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.authService.getToken(),
    };
    return this.http.get<IResponseList>(
      `${this.baseUrl}/api/document/get-all-by-uploader`,
      { headers }
    );
  }

  //save document file pdf to endpoint /api/document/upload
  saveDocument(formData: FormData): Observable<any> {
    const headers = {
      Authorization: 'Bearer ' + this.authService.getToken(),
    };
    return this.http.post(`${this.baseUrl}/api/document/upload`, formData, {
      headers,
    });
  }

  // assign approver to endpoint /api/document/{{idDocument}}/assign-approvers

  assignApprover(idDocument: number, approverIds: any): Observable<any> {
    const headers = {
      Authorization: 'Bearer ' + this.authService.getToken(),
    };
    return this.http.post(
      `${this.baseUrl}/api/document/${idDocument}/assign-approvers/`,
      approverIds,
      { headers }
    );
  }
}
