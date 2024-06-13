import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {IResponseList} from "../interfaces/i-response-list";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {IBarangPost} from "../interfaces/interfaces-barang/i-barang-post";
import {IDashboard} from "../interfaces/interface-dashboard/i-dashboard";

@Injectable()
export class DashboardService {
  baseUrl = environment.apiBaseUrl
  keyToken: string = 'token'

  constructor(private http: HttpClient, private authService : AuthService) { }
  getCountBarang(): Observable<IDashboard> {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authService.getToken()
    }
    return this.http.get<IDashboard>(`${this.baseUrl}/api/barang-mgmnt/v1/total-barang`, {headers})
  }

  getCountPeminjamanBarang(): Observable<IDashboard> {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authService.getToken()
    }
    return this.http.get<IDashboard>(`${this.baseUrl}/api/pinjam-mgmnt/v1/total-peminjaman-barang`, {headers})
  }

  getCountPermintaanBarang(): Observable<IDashboard> {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authService.getToken()
    }
    return this.http.get<IDashboard>(`${this.baseUrl}/api/permintaan-mgmnt/v1/total-permintaan-barang`, {headers})
  }

  getCountKategoriBarang(): Observable<IDashboard> {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authService.getToken()
    }
    return this.http.get<IDashboard>(`${this.baseUrl}/api/kategori-mgmnt/v1/total-kategori-barang`, {headers})
  }
}
