import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/auth';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { ISignin } from '../interfaces/interfaces-auth/i-signin';
import { Observable } from 'rxjs';
import { ISignInResponse } from '../interfaces/interfaces-auth/i-signin-response';
import * as CryptoJS from 'crypto-js';
import { ISignup } from '../interfaces/interfaces-auth/i-signup';
import { ISignupResponse } from '../interfaces/interfaces-auth/i-signup-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn: boolean = false;
  baseUrl = environment.apiBaseUrl;
  keyToken: string = 'token';
  role: string = '';
  private encryptionKey: string = 'R4H4S1A'; // Keep this secure!

  constructor(private http: HttpClient, private router: Router) {}

  signIn(user: ISignin): Observable<ISignInResponse> {
    const headers = {
      'Content-Type': 'application/json',
    };

    const body = JSON.stringify(user);
    return this.http.post<ISignInResponse>(
      `${this.baseUrl}/api/auth0/login`,
      body,
      { headers }
    );
  }

  signUp(user: ISignup): Observable<ISignupResponse> {
    const headers = {
      'Content-Type': 'application/json',
    };

    const body = JSON.stringify(user);
    return this.http.post<ISignupResponse>(
      `${this.baseUrl}/api/auth0/v1/regis`,
      body,
      { headers }
    );
  }

  setAuth(token: string) {
    localStorage.setItem(this.keyToken, token);
    this.isLoggedIn = true;
  }

  // Encrypt role
  setRole(role: string) {
    const encryptedRole = CryptoJS.AES.encrypt(
      role,
      this.encryptionKey
    ).toString();
    localStorage.setItem('rl', encryptedRole);
    // Don't store the role in plain text
  }

  setEmail(email: string) {
    localStorage.setItem('email', email);
  }

  // Decrypt role on retrieval
  getRole(): string {
    const encryptedRole = localStorage.getItem('rl') || '';
    if (encryptedRole) {
      // Check if the role is encrypted
      if (encryptedRole.startsWith('U2FsdGVkX')) {
        // Role is encrypted, decrypt it
        const bytes = CryptoJS.AES.decrypt(encryptedRole, this.encryptionKey);
        return bytes.toString(CryptoJS.enc.Utf8);
      } else {
        this.logout();
        return '';
      }
    } else {
      return '';
    }
  }

  // isAuth(): boolean {
  //   if (localStorage.getItem(this.keyToken)) {
  //     this.isLoggedIn = true;
  //     return this.isLoggedIn;
  //   }
  //   return false;
  // }

  getToken(): string {
    return localStorage.getItem(this.keyToken) || '';
  }

  getEmail(): string {
    return localStorage.getItem('email') || '';
  }

  logout() {
    localStorage.removeItem('email');
    localStorage.removeItem(this.keyToken);
    localStorage.removeItem('rl');
    this.isLoggedIn = false;
    this.router.navigate(['/auth/login']);
  }

  isTokenValid(token: string): boolean {
    return token.length > 300;
  }

  isAuth(): boolean {
    const token = localStorage.getItem(this.keyToken);
    if (token && this.isTokenValid(token)) {
      this.isLoggedIn = true;
      return this.isLoggedIn;
    }
    return false;
  }

  // Modify role-checking methods:
  isAdminLoggedIn(): boolean {
    return this.getRole() === 'superadmin' || this.getRole() === 'admin';
  }

  isCustomerLoggedIn(): boolean {
    return this.getRole() === 'customer';
  }
}
