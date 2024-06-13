import { Injectable } from '@angular/core';
import { IBarangPost } from '../interfaces/interfaces-barang/i-barang-post';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { IResponseList } from '../interfaces/i-response-list';

@Injectable()
export class PinjambaranguserService {
  baseUrl = environment.apiBaseUrl;
  keyToken: string = 'token';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getPeminjamanBarang(): Observable<IResponseList> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.authService.getToken(),
    };
    return this.http.get<IResponseList>(
      `${this.baseUrl}/api/document/uploader/1/asc/fileName?uploaderId=1`,
      { headers }
    );
  }

  getPeminjamanBarangDetail(idPeminjamanBarang?: number) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.authService.getToken(),
    };
    return this.http.get<IResponseList>(
      `${this.baseUrl}/api/pinjam-mgmnt/v1/usr-req-pinjam-get-one-data/${idPeminjamanBarang}`,
      { headers }
    );
  }

  usrReqPinjamBarang(savePinjam: any) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.authService.getToken(),
    };

    console.log(savePinjam);

    return this.http.post(
      `${this.baseUrl}/api/pinjam-mgmnt/v1/usr-req-pinjam`,
      savePinjam,
      { headers }
    );
  }

  deletePeminjamanBarang(idPeminjamanBarang?: number) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.authService.getToken(),
    };
    console.log(idPeminjamanBarang);
    return this.http.delete(
      `${this.baseUrl}/api/pinjam-mgmnt/v1/usr-req-pinjam-cancel-req/${idPeminjamanBarang}`,
      { headers }
    );
  }
}
