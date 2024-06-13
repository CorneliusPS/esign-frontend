import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { IResponseList } from '../interfaces/i-response-list';

@Injectable()
export class UserService {
  baseUrl = environment.apiBaseUrl;
  keyToken: string = 'token';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Get All User
  getAllUser(): Observable<IResponseList> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.authService.getToken(),
    };
    return this.http.get<IResponseList>(
      `${this.baseUrl}/api/user-mgmnt/get-all-for-assign-approver`,
      {
        headers,
      }
    );
  }
}
