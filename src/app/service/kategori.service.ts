import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Kategori } from '../api/kategori';
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {AuthService} from "./auth.service";
import {IResponseList} from "../interfaces/i-response-list";
import {IKategori} from "../interfaces/interfaces-kategori/i-kategori";

@Injectable()
export class KategoriService {
  baseUrl = environment.apiBaseUrl
  keyToken: string = 'token'

  constructor(private http: HttpClient, private authService : AuthService) { }

  getKategorisSmall() {
    return this.http.get<any>('assets/demo/data/products-small.json')
      .toPromise()
      .then(res => res.data as Kategori[])
      .then(data => data);
  }

  getKategoris() {
    return this.http.get<any>('assets/demo/data/kategori.json')
      .toPromise()
      .then(res => res.data as Kategori[])
      .then(data => data);
  }

  getKategori(): Observable<IResponseList> {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authService.getToken()
    }
    return this.http.get<IResponseList>(`${this.baseUrl}/api/kategori-mgmnt/v1/kategori-barang`, {headers})
  }

  saveKategori(postKategori: any) {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authService.getToken()
    }
    return this.http.post(`${this.baseUrl}/api/kategori-mgmnt/v1/kategori-barang`, postKategori, {headers})
  }

  updateKategori(putKategori: any, id: number) {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authService.getToken()
    }
    return this.http.put(`${this.baseUrl}/api/kategori-mgmnt/v1/kategori-barang/${id}`, putKategori, {headers})
  }

  deleteKategori(id?: string) {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authService.getToken()
    }
    return this.http.delete(`${this.baseUrl}/api/kategori-mgmnt/v1/kategori-barang/${id}`, {headers})
  }

  getKategorisMixed() {
    return this.http.get<any>('assets/demo/data/products-mixed.json')
      .toPromise()
      .then(res => res.data as Kategori[])
      .then(data => data);
  }

  getKategorisWithOrdersSmall() {
    return this.http.get<any>('assets/demo/data/products-orders-small.json')
      .toPromise()
      .then(res => res.data as Kategori[])
      .then(data => data);
  }
}
