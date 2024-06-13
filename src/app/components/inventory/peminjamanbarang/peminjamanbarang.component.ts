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

@Component({
    selector: 'app-kategori',
    templateUrl: './peminjamanbarang.component.html',
    providers: [MessageService]
})
export class PeminjamanbarangComponent implements OnInit {

  peminjamanDialog: boolean = false;

  deletePeminjamanDialog: boolean = false;

  peminjamanBarangs: IPeminjamanBarang[] = [];

  peminjamanBarang: IPeminjamanBarang = {};

  accRejPeminjamanBarang: IPeminjamanBarangAccRej = {};

  selectedPeminjamanBarangs: IPeminjamanBarang[] = [];

  submitted: boolean = false;

  cols: any[] = [];

  statuses: any[] = [];

  rowsPerPageOptions = [5, 10, 20];

  error: IError;

  constructor( private peminjamanbarangService : PeminjamanbarangService, private authService: AuthService, private messageService: MessageService ) {
    this.error = {
      status: false,
      message: '',
      timestamp: 0
    }
    this.accRejPeminjamanBarang = {
      catatanAdmin: ''
    }
  }

  ngOnInit() {

    this.getPeminjamanBarang()

    this.cols = [
      { field: 'email', header: 'Email' },
      { field: 'noHp', header: 'No Hp' },
      { field: 'kodeBarang', header: 'Kode Barang' },
      { field: 'namaBarang', header: 'Nama Barang' },
      { field: 'imageBarang', header: 'Foto Barang' },
      { field: 'tanggalPeminjaman', header: 'Tanggal Peminjaman' },
      { field: 'tanggalPengambilan', header: 'Tanggal Pengambilan' },
      { field: 'statusPeminjaman', header: 'Status Peminjaman' },
      { field: 'jumlahPeminjaman', header: 'Jumlah Peminjaman' },
      { field: 'catatanAdmin', header: 'Catatan Admin' },
    ];
  }

  getPeminjamanBarang() {
    this.peminjamanbarangService.getPeminjamanBarang().pipe(catchError((error: HttpErrorResponse) => {
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
      })
  }

  openNew() {
    this.peminjamanBarang = {};
    this.submitted = false;
    this.peminjamanDialog = true;
  }

  editPeminjamanBarang(peminjamanBarangAccRej: IPeminjamanBarangAccRej) {
    this.accRejPeminjamanBarang = {
      idPeminjamanBarang: peminjamanBarangAccRej.idPeminjamanBarang,
      catatanAdmin: peminjamanBarangAccRej.catatanAdmin,
      ltBarang: peminjamanBarangAccRej.ltBarang
    };
    this.peminjamanDialog = true;
  }

  deletePeminjamanBarang(peminjamanBarang: IPeminjamanBarang) {
    this.deletePeminjamanDialog = true;
    this.peminjamanBarang = { ...peminjamanBarang };
  }

  confirmDeleteSelected() {
    this.deletePeminjamanDialog = false;
    this.peminjamanBarangs = this.peminjamanBarangs.filter(val => !this.peminjamanBarangs.includes(val));
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Peminjaman Barang Deleted', life: 3000 });
    this.selectedPeminjamanBarangs = [];
  }

  confirmDelete() {
    this.deletePeminjamanDialog = false;
    this.peminjamanBarangs = this.peminjamanBarangs.filter(val => val.idPeminjamanBarang !== this.peminjamanBarang.idPeminjamanBarang);
    console.log("Ini masuk")
    console.log(this.peminjamanBarang.idPeminjamanBarang)
    this.peminjamanbarangService.deletePeminjamanBarang(this.peminjamanBarang.idPeminjamanBarang).pipe(catchError((error: HttpErrorResponse) => {
      this.error = {
        status: true,
        message: error.error.message,
        timestamp: error.error.timestamp
      }
      console.log(error.status)
      if (error.status == 401) {
        this.authService.logout()
      }
      this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Peminjaman Barang Does Not Exist', life: 3000 });
      return throwError(() => new Error('Error Peminjaman Barang'))
    }))
      .subscribe(response => {
        this.peminjamanDialog = false;
        this.getPeminjamanBarang()
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Peminjaman Barang Deleted', life: 3000 });
      })
  }

  hideDialog() {
    this.peminjamanDialog = false;
    this.submitted = false;
  }

  accPeminjaman() {
    this.submitted = true;

    if (this.accRejPeminjamanBarang.idPeminjamanBarang) {

      const requestBody = {
        idPeminjamanBarang: this.accRejPeminjamanBarang.idPeminjamanBarang,
        catatanAdmin: this.accRejPeminjamanBarang.catatanAdmin
      };

      this.peminjamanbarangService.handleAccPeminjamanBarang(requestBody, this.accRejPeminjamanBarang.idPeminjamanBarang).pipe(catchError((error: HttpErrorResponse) => {
        this.error = {
          status: true,
          message: error.error.message,
          timestamp: error.error.timestamp
        }
        console.log(error.status)
        if (error.status == 401) {
          this.authService.logout()
        }
        if (error.status == 406) {
          this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Peminjaman Barang Sudah Ditolak/Diterima', life: 3000 });
          return throwError(() => new Error('Error peminjaman barang'))
        }
        this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Kode Peminjaman Barang Already Exist', life: 3000 });
          return throwError(() => new Error('Error peminjaman barang'))
        }))
        .subscribe(response => {
          this.peminjamanDialog = false;
          this.getPeminjamanBarang()
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Peminjaman Barang Updated', life: 3000 });
        })
    }
  }

  rejPeminjaman() {
    this.submitted = true;

    if (this.accRejPeminjamanBarang.idPeminjamanBarang) {

      let idBarang: string | undefined = "0"

      if (this.accRejPeminjamanBarang.ltBarang) {
        idBarang = this.accRejPeminjamanBarang.ltBarang[0]?.idBarang
      }

      const requestBody = {
        idPeminjamanBarang: this.accRejPeminjamanBarang.idPeminjamanBarang,
        catatanAdmin: this.accRejPeminjamanBarang.catatanAdmin
      };
      this.peminjamanbarangService.handleRejPeminjamanBarang(requestBody, this.accRejPeminjamanBarang.idPeminjamanBarang, idBarang).pipe(catchError((error: HttpErrorResponse) => {
        this.error = {
          status: true,
          message: error.error.message,
          timestamp: error.error.timestamp
        }
        console.log(error.status)
        if (error.status == 401) {
          this.authService.logout()
        }
        if (error.status == 406) {
          this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Peminjaman Barang Sudah Ditolak/Diterima', life: 3000 });
          return throwError(() => new Error('Error peminjaman barang'))
        }
        this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Kode Peminjaman Barang Already Exist', life: 3000 });
        return throwError(() => new Error('Error peminjaman barang'))
      }))
        .subscribe(response => {
          this.peminjamanDialog = false;
          this.getPeminjamanBarang()
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Peminjaman Barang Updated', life: 3000 });
        })
    }
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

  findIndexById(idPeminjamanBarang: number): number {
    let index = -1;
    for (let i = 0; i < this.peminjamanBarangs.length; i++) {
      if (this.peminjamanBarangs[i].idPeminjamanBarang === idPeminjamanBarang) {
        index = i;
        break;
      }
    }

    return index;
  }

  createId(): string {
    let id = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  onGlobalFilter(table: Table, event: Event) {
    console.log("Global filter value:", (event.target as HTMLInputElement).value);
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

}
