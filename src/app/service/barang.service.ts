import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {IResponseList} from "../interfaces/i-response-list";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {IBarangPost} from "../interfaces/interfaces-barang/i-barang-post";

@Injectable()
export class BarangService {
  baseUrl = environment.apiBaseUrl
  keyToken: string = 'token'

  constructor(private http: HttpClient, private authService : AuthService) { }
  getBarang(): Observable<IResponseList> {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authService.getToken()
    }
    return this.http.get<IResponseList>(`${this.baseUrl}/api/barang-mgmnt/v1/barang`, {headers})
  }


  saveBarang(postBarang: IBarangPost, formData: FormData) {

    const headers = {
      'Authorization': 'Bearer ' + this.authService.getToken()
    }
    // const formData = new FormData();
    var url = `${this.baseUrl}/api/barang-mgmnt/v1/barang-new`;

    // if (postBarang.imageBarang) {
    //   formData.append('imageBarang', postBarang.imageBarang);
    // }

    if(postBarang.kodeBarang && postBarang.namaBarang && postBarang.hargaBarang && postBarang.stokBarang && postBarang.statusBarang && postBarang.deskripsiBarang && postBarang.kategoriBarang?.idKategori){
      url += `?kodeBarang=${postBarang.kodeBarang}&namaBarang=${postBarang.namaBarang}&hargaBarang=${postBarang.hargaBarang}&stokBarang=${postBarang.stokBarang}&statusBarang=${postBarang.statusBarang}&deskripsiBarang=${postBarang.deskripsiBarang}&idKategori=${postBarang.kategoriBarang?.idKategori}`;
    }
    return this.http.post(url, formData, {headers})
  }

  updateBarang(postBarang: any, formData: FormData, id: number) {
    const headers = {
      'Authorization': 'Bearer ' + this.authService.getToken()
    }

    var url = `${this.baseUrl}/api/barang-mgmnt/v1/barang-update/${id}`;

    if (postBarang.stokBarang === 0) {
      postBarang.stokBarang = "0";
      postBarang.statusBarang = "OUTOFSTOCK"
    } else {
      postBarang.statusBarang = "INSTOCK"
    }

    if(postBarang.kodeBarang && postBarang.namaBarang && postBarang.hargaBarang && postBarang.stokBarang && postBarang.statusBarang && postBarang.deskripsiBarang && postBarang.kategoriBarang?.idKategori){
      url += `?kodeBarang=${postBarang.kodeBarang}&namaBarang=${postBarang.namaBarang}&hargaBarang=${postBarang.hargaBarang}&stokBarang=${postBarang.stokBarang}&statusBarang=${postBarang.statusBarang}&deskripsiBarang=${postBarang.deskripsiBarang}&idKategori=${postBarang.kategoriBarang?.idKategori}`;
    }
    return this.http.put(url, formData, {headers})
  }

  deleteBarang(id?: string) {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authService.getToken()
    }
    return this.http.delete(`${this.baseUrl}/api/barang-mgmnt/v1/barang/${id}`, {headers})
  }
}
