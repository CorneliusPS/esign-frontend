import { Component, OnInit } from '@angular/core';
import {MessageService, SelectItem} from 'primeng/api';
import {Table} from "primeng/table";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, throwError} from "rxjs";
import {IError} from "../../../interfaces/i-error";
import {IResponseList} from "../../../interfaces/i-response-list";
import {AuthService} from "../../../service/auth.service";
import {IPeminjamanBarang} from "../../../interfaces/interfaces-peminjaman/i-peminjaman-barang";
import {PeminjamanbarangService} from "../../../service/peminjamanbarang.service";
import {IPeminjamanBarangAccRej} from "../../../interfaces/interfaces-peminjaman/i-peminjaman-barang-acc-rej";
import {KategoriService} from "../../../service/kategori.service";
import {BarangService} from "../../../service/barang.service";
import {FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";
import {IPeminjamanUsrGet} from "../../../interfaces/interface-peminjaman-user/i-peminjaman-usr-get";
import {IBarang} from "../../../interfaces/interfaces-barang/i-barang";
import {PinjambaranguserService} from "../../../service/pinjambaranguser.service";
import {IPermintaanUsrGet} from "../../../interfaces/interface-permintaan-user/i-permintaan-usr-get";
import {MintabaranguserService} from "../../../service/mintabaranguser.service";

@Component({
    templateUrl: './welcome.component.html',
    providers: [MessageService]
})
export class WelcomeComponent implements OnInit {

  cols: any[] = [];

  colsPermintaan: any[] = [];

  peminjamanBarangs: IPeminjamanUsrGet[] = [];

  selectedBarangs: IBarang[] = [];

  permintaanBarangs: IPermintaanUsrGet[] = [];

  error: IError;

  constructor(private pinjambaranguserService: PinjambaranguserService, private mintabaranguserService: MintabaranguserService, private authService: AuthService, private barangService: BarangService, private formBuilder : FormBuilder, private messageService: MessageService, private router: Router, private http: HttpClient) {
    this.error = {
      status: false,
      message: '',
      timestamp: 0
    }
  }

  ngOnInit(): void {
    this.getBarang()
    this.getPermintaanBarang()
    this.cols = [
      { field: 'kodeBarang', header: 'Kode Barang' },
      { field: 'namaBarang', header: 'Nama' },
      { field: 'imageBarang', header: 'Gambar' },
      { field: 'imageId', header: 'Gambar ID' },
      { field: 'hargaBarang', header: 'Harga' },
      { field: 'stokBarang', header: 'Stok' },
      { field: 'statusBarang', header: 'Status' },
      { field: 'deskripsiBarang', header: 'Deskripsi' },
      { field: 'kategoriBarang', header: 'Kategori' },
      { field: 'createdBy', header: 'Created By' },
      { field: 'createdDate', header: 'Created Date' }
    ];

  }

  getBarang() {
    this.pinjambaranguserService.getPeminjamanBarang().pipe(catchError((error: HttpErrorResponse) => {
      this.error = {
        status: true,
        message: error.error.message,
        timestamp: error.error.timestamp
      }
      if (error.status == 401) {
        this.authService.logout()
      }
      return throwError(() => new Error('Error Peminjaman Barang'))
    }))
      .subscribe((response: IResponseList) => {
        this.peminjamanBarangs = response.data
        console.log(this.peminjamanBarangs)
      })
  }

  getPermintaanBarang() {
    this.mintabaranguserService.getPermintaanBarang().pipe(catchError((error: HttpErrorResponse) => {
      this.error = {
        status: true,
        message: error.error.message,
        timestamp: error.error.timestamp
      }
      if (error.status == 401) {
        this.authService.logout()
      }
      return throwError(() => new Error('Error Permintaan Barang'))
    }))
      .subscribe((response: IResponseList) => {
        this.permintaanBarangs = response.data
        console.log(this.permintaanBarangs)
      })
  }

  getPeminjamanDetail(idPeminjaman: number) {
    this.router.navigate(['/home/welcome-detail-pinjam', idPeminjaman]);
  }

  getPermintaanDetail(idPermintaan: number) {
    this.router.navigate(['/home/welcome-detail-permintaan', idPermintaan])
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'ACCEPTED':
        return 'product-badge status-instock';
      case 'REJECTED':
        return 'product-badge status-outofstock';
      case 'PENDING':
        return 'product-badge status-lowstock';
      default:
        return '';
    }
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
