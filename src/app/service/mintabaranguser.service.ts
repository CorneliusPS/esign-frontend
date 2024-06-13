import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {IBarangPost} from "../interfaces/interfaces-barang/i-barang-post";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {IPermintaanUsrReq} from "../interfaces/interface-permintaan-user/i-permintaan-usr-req";
import {IResponseList} from "../interfaces/i-response-list";
import {Observable} from "rxjs";

@Injectable()
export class MintabaranguserService {
  baseUrl = environment.apiBaseUrl
  keyToken: string = 'token'

  constructor(private http: HttpClient, private authService : AuthService) { }

  getPermintaanBarang(): Observable<IResponseList> {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authService.getToken()
    }
    return this.http.get<IResponseList>(`${this.baseUrl}/api/permintaan-mgmnt/v1/usr-req-permintaan-get-all-data`, {headers})
  }

  getPermintaanBarangDetail(idPermintaanBarang?: number) {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authService.getToken()
    }
    return this.http.get<IResponseList>(`${this.baseUrl}/api/permintaan-mgmnt/v1/usr-req-permintaan-get-one-data/${idPermintaanBarang}`, {headers})
  }

  submitPermintaanBarang(iPermintaanUsrReq: IPermintaanUsrReq | undefined, formData: FormData) {

    const headers = {
      'Authorization': 'Bearer ' + this.authService.getToken()
    }

    var url = `${this.baseUrl}/api/permintaan-mgmnt/v1/usr-req-permintaan`;

    if(iPermintaanUsrReq?.namaBarang && iPermintaanUsrReq.deskripsiBarang && iPermintaanUsrReq.jumlahPermintaan && iPermintaanUsrReq.tanggalPermintaan){
      url += `?namaBarang=${iPermintaanUsrReq.namaBarang}&deskripsiBarang=${iPermintaanUsrReq.deskripsiBarang}&jumlahPermintaan=${iPermintaanUsrReq.jumlahPermintaan}&tanggalPermintaan=${iPermintaanUsrReq.tanggalPermintaan}`;
    }
    return this.http.post(url, formData, {headers})
  }

  deletePermintaanBarang(id?: number) {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authService.getToken()
    }
    return this.http.delete(`${this.baseUrl}/api/permintaan-mgmnt/v1/usr-req-permintaan-cancel-req/${id}`, {headers})
  }
}
