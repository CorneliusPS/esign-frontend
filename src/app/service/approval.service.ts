import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { IResponseList } from '../interfaces/i-response-list';

@Injectable()
export class ApprovalService {
  baseUrl = environment.apiBaseUrl;
  keyToken: string = 'token';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getOneDocument(idDocument: number) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.authService.getToken(),
    };
    return this.http.get(`${this.baseUrl}/api/document/${idDocument}`, {
      headers,
    });
  }

  getAllAprover(): Observable<IResponseList> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.authService.getToken(),
    };
    return this.http.get<IResponseList>(
      `${this.baseUrl}/api/approval/get-all-by-user`,
      { headers }
    );
  }
}
