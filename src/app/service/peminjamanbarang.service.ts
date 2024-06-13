import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {IResponseList} from "../interfaces/i-response-list";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {IBarangPost} from "../interfaces/interfaces-barang/i-barang-post";

@Injectable()
export class PeminjamanbarangService {
  baseUrl = environment.apiBaseUrl
  keyToken: string = 'token'

  constructor(private http: HttpClient, private authService : AuthService) { }
  getPeminjamanBarang(): Observable<IResponseList> {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authService.getToken()
    }
    return this.http.get<IResponseList>(`${this.baseUrl}/api/pinjam-mgmnt/v1/adm-req-pinjam-get-all-data-adm`, {headers})
  }

  handleAccPeminjamanBarang(updatePeminjaman: any, id: number | undefined) {

    console.log("Masuk sini")
    console.log(updatePeminjaman)
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authService.getToken()
    }
    return this.http.put(`${this.baseUrl}/api/pinjam-mgmnt/v1/adm-req-pinjam-handle-acc/${id}`, updatePeminjaman, {headers})
  }

  handleRejPeminjamanBarang(updatePeminjaman: any, id: number, idBarang: string | undefined) {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authService.getToken()
    }

    return this.http.put(`${this.baseUrl}/api/pinjam-mgmnt/v1/adm-req-pinjam-handle-rej/${id}/${Number(idBarang)}`, updatePeminjaman, {headers})
  }

  deletePeminjamanBarang(id?: number) {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authService.getToken()
    }
    return this.http.delete(`${this.baseUrl}/api/pinjam-mgmnt/v1/adm-req-pinjam-delete-req/${id}`, {headers})
  }
}
