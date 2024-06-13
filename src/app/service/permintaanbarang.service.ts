import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {Observable} from "rxjs";
import {IResponseList} from "../interfaces/i-response-list";

@Injectable()
export class PermintaanbarangService {
  baseUrl = environment.apiBaseUrl
  keyToken: string = 'token'

  constructor(private http: HttpClient, private authService : AuthService) { }
  getPermintaanBarang(): Observable<IResponseList> {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authService.getToken()
    }
    return this.http.get<IResponseList>(`${this.baseUrl}/api/permintaan-mgmnt/v1/adm-req-permintaan-get-all-data-adm`, {headers})
  }

  handleAccPermintaanBarang(updatePermintaan: any, id: number | undefined) {

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authService.getToken()
    }
    return this.http.put(`${this.baseUrl}/api/permintaan-mgmnt/v1/adm-req-permintaan-handle-acc/${id}`, updatePermintaan, {headers})
  }

  handleRejPermintaanBarang(updatePermintaan: any, id: number) {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authService.getToken()
    }
    return this.http.put(`${this.baseUrl}/api/permintaan-mgmnt/v1/adm-req-permintaan-handle-rej/${id}`, updatePermintaan, {headers})
  }

  deletePermintaanBarang(id?: number) {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authService.getToken()
    }
    return this.http.delete(`${this.baseUrl}/api/permintaan-mgmnt/v1/adm-req-permintaan-delete-req/${id}`, {headers})
  }
}
