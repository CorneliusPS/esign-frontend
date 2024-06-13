import { Component, OnInit } from '@angular/core';
import {MessageService, SelectItem} from 'primeng/api';
import {Table} from "primeng/table";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, throwError} from "rxjs";
import {IError} from "../../../interfaces/i-error";
import {IResponseList} from "../../../interfaces/i-response-list";
import {AuthService} from "../../../service/auth.service";
import {IPermintaanBarang} from "../../../interfaces/interface-permintaan/i-permintaan-barang";
import {IPermintaanBarangAccRej} from "../../../interfaces/interface-permintaan/i-permintaan-barang-acc-rej";
import {PermintaanbarangService} from "../../../service/permintaanbarang.service";

@Component({
    selector: 'app-kategori',
    templateUrl: './permintaanbarang.component.html',
    providers: [MessageService]
})
export class PermintaanbarangComponent implements OnInit {

  permintaanDialog: boolean = false;

  deletePermintaanDialog: boolean = false;

  permintaanBarangs: IPermintaanBarang[] = [];

  permintaanBarang: IPermintaanBarang = {};

  accRejPermintaanBarang: IPermintaanBarangAccRej = {};

  selectedPermintaanBarangs: IPermintaanBarang[] = [];

  submitted: boolean = false;

  cols: any[] = [];

  statuses: any[] = [];

  rowsPerPageOptions = [5, 10, 20];

  error: IError;

  constructor( private permintaanbarangService : PermintaanbarangService, private authService: AuthService, private messageService: MessageService ) {
    this.error = {
      status: false,
      message: '',
      timestamp: 0
    }
    this.accRejPermintaanBarang = {
      catatanAdmin: ''
    }
  }

  ngOnInit() {

    this.getPermintaanBarang()

    this.cols = [
      { field: 'idPermintaanBarang', header: 'Tanggal Permintaan' },
      { field: 'tanggalPengambilan', header: 'Tanggal Pengambilan' },
      { field: 'statusPermintaan', header: 'Status Permintaan' },
      { field: 'jumlahPermintaan', header: 'Jumlah Permintaan' },
      { field: 'catatanAdmin', header: 'Catatan Admin' },
      { field: 'email', header: 'Email' },
      { field: 'noHp', header: 'No Hp' },
      { field: 'kodeBarang', header: 'Kode Barang' },
      { field: 'namaBarang', header: 'Nama Barang' },
      { field: 'imageBarang', header: 'Foto Barang' },
    ];
  }

  getPermintaanBarang() {
    this.permintaanbarangService.getPermintaanBarang().pipe(catchError((error: HttpErrorResponse) => {
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

  openNew() {
    this.permintaanBarang = {};
    this.submitted = false;
    this.permintaanDialog = true;
  }

  editPermintaanBarang(permintaanBarangAccRej: IPermintaanBarangAccRej) {
    this.accRejPermintaanBarang = {
      idPermintaanBarang: permintaanBarangAccRej.idPermintaanBarang,
      catatanAdmin: permintaanBarangAccRej.catatanAdmin
    };
    this.permintaanDialog = true;
  }

  deletePermintaanBarang(permintaanBarang: IPermintaanBarang) {
    this.deletePermintaanDialog = true;
    this.permintaanBarang = { ...permintaanBarang };
  }

  confirmDeleteSelected() {
    this.deletePermintaanDialog = false;
    this.permintaanBarangs = this.permintaanBarangs.filter(val => !this.permintaanBarangs.includes(val));
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Permintaan Barang Deleted', life: 3000 });
    this.selectedPermintaanBarangs = [];
  }

  confirmDelete() {
    this.deletePermintaanDialog = false;
    this.permintaanBarangs = this.permintaanBarangs.filter(val => val.idPermintaanBarang !== this.permintaanBarang.idPermintaanBarang);
    console.log("Ini masuk")
    console.log(this.permintaanBarang.idPermintaanBarang)
    this.permintaanbarangService.deletePermintaanBarang(this.permintaanBarang.idPermintaanBarang).pipe(catchError((error: HttpErrorResponse) => {
      this.error = {
        status: true,
        message: error.error.message,
        timestamp: error.error.timestamp
      }
      console.log(error.status)
      if (error.status == 401) {
        this.authService.logout()
      }
      this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Permintaan Barang Does Not Exist', life: 3000 });
      return throwError(() => new Error('Error Permintaan Barang'))
    }))
      .subscribe(response => {
        this.permintaanDialog = false;
        this.getPermintaanBarang()
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Permintaan Barang Deleted', life: 3000 });
      })
  }

  hideDialog() {
    this.permintaanDialog = false;
    this.submitted = false;
  }

  accPermintaan() {
    this.submitted = true;

    if (this.accRejPermintaanBarang.idPermintaanBarang) {
      this.permintaanbarangService.handleAccPermintaanBarang(this.accRejPermintaanBarang, this.accRejPermintaanBarang.idPermintaanBarang).pipe(catchError((error: HttpErrorResponse) => {
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
          this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Permintaan Barang Sudah Ditolak', life: 3000 });
          return throwError(() => new Error('Error permintaan barang'))
        }
        this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Kode Permintaan Barang Already Exist', life: 3000 });
          return throwError(() => new Error('Error permintaan barang'))
        }))
        .subscribe(response => {
          this.permintaanDialog = false;
          this.getPermintaanBarang()
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Permintaan Barang Updated', life: 3000 });
        })
    }
  }

  rejPermintaan() {
    this.submitted = true;

    if (this.accRejPermintaanBarang.idPermintaanBarang) {
      this.permintaanbarangService.handleRejPermintaanBarang(this.accRejPermintaanBarang, this.accRejPermintaanBarang.idPermintaanBarang).pipe(catchError((error: HttpErrorResponse) => {
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
          this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Permintaan Barang Sudah Diterima', life: 3000 });
          return throwError(() => new Error('Error permintaan barang'))
        }
        this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Kode Permintaan Barang Already Exist', life: 3000 });
        return throwError(() => new Error('Error permintaan barang'))
      }))
        .subscribe(response => {
          this.permintaanDialog = false;
          this.getPermintaanBarang()
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Permintaan Barang Updated', life: 3000 });
        })
    }
  }

  getStatusBadgeClass(status: string): string {
    console.log(status)
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

  findIndexById(idPermintaanBarang: number): number {
    let index = -1;
    for (let i = 0; i < this.permintaanBarangs.length; i++) {
      if (this.permintaanBarangs[i].idPermintaanBarang === idPermintaanBarang) {
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
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
