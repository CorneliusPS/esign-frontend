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

  getOneApprover(idApprover: number) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.authService.getToken(),
    };
    return this.http.get(`${this.baseUrl}/api/approval/get-one/${idApprover}`, {
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

  signDocument(idDocument: number, signature: FormData): Observable<any> {
    const headers = {
      Authorization: 'Bearer ' + this.authService.getToken(),
    };
    return this.http.post(
      `${this.baseUrl}/api/signature/${idDocument}/sign-document`,
      signature,
      { headers }
    );
  }

  sendOtp(idApprover: number): Observable<any> {
    const headers = {
      Authorization: 'Bearer ' + this.authService.getToken(),
    };
    return this.http.post(
      `${this.baseUrl}/api/approval/send-otp?idApprover=${idApprover}`,
      {},
      { headers }
    );
  }

  verifOtp(idApprover: number, body: any): Observable<any> {
    const headers = {
      Authorization: 'Bearer ' + this.authService.getToken(),
    };
    console.log(body);
    return this.http.post(
      `${this.baseUrl}/api/approval/verif-otp?idApprover=${idApprover}`,
      body,
      { headers }
    );
  }
}
