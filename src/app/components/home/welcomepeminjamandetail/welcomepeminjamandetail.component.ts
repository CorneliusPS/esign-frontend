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
import {ActivatedRoute, Router} from "@angular/router";
import {IPeminjamanUsrGet} from "../../../interfaces/interface-peminjaman-user/i-peminjaman-usr-get";
import {IBarang} from "../../../interfaces/interfaces-barang/i-barang";
import {PinjambaranguserService} from "../../../service/pinjambaranguser.service";
import Swal from "sweetalert2";

@Component({
    templateUrl: './welcomepeminjamandetail.component.html',
    styleUrls: ['welcomepeminjamandetail.css'],
    providers: [MessageService]
})
export class WelcomepeminjamandetailComponent implements OnInit {

  cols: any[] = [];

  peminjamanBarang?: IPeminjamanUsrGet;

  selectedBarangs: IBarang[] = [];

  // peminjamanBarang: IPeminjamanUsrGet = {};

  peminjamanBarangId: string = '';

  deletePeminjamanDialog: boolean = false;

  submitted: boolean = false;

  error: IError;

  constructor(private pinjambaranguserService: PinjambaranguserService, private authService: AuthService, private barangService: BarangService, private formBuilder : FormBuilder, private messageService: MessageService, private router: Router, private http: HttpClient, private activatedRoute: ActivatedRoute) {
    this.error = {
      status: false,
      message: '',
      timestamp: 0
    }
  }

  ngOnInit(): void {
    this.peminjamanBarangId = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.getBarang()

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
    console.log(Number(this.peminjamanBarangId))
    this.pinjambaranguserService.getPeminjamanBarangDetail(Number(this.peminjamanBarangId)).pipe(catchError((error: HttpErrorResponse) => {
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
        this.peminjamanBarang = response.data
        console.log("Masuk sini")
        console.log(this.peminjamanBarang?.statusPeminjaman)
        console.log(this.peminjamanBarang?.jumlahPeminjaman)
        console.log(this.peminjamanBarang?.ltBarang[0].namaBarang)
      })
  }

  confirm() {
    this.deletePeminjamanDialog = true;
  }

  hideDialog() {
    this.deletePeminjamanDialog = false;
    this.submitted = false;
  }

  confirmDelete(idPeminjamanBarang: number) {
    this.deletePeminjamanDialog = false;
    this.pinjambaranguserService.deletePeminjamanBarang(idPeminjamanBarang).pipe(catchError((error: HttpErrorResponse) => {
      this.error = {
        status: true,
        message: error.error.message,
        timestamp: error.error.timestamp
      }
      if (error.status == 401) {
        this.authService.logout()
      }
      this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Peminjaman Barang Does Not Exist', life: 3000 });
      return throwError(() => new Error('Error peminjaman barang'))
    }))
      .subscribe(response => {
        this.deletePeminjamanDialog = false;
        Swal.fire({
          icon: "success",
          title: "Peminjaman barang berhasil dibatalkan",
          showConfirmButton: true,
          // timer: 1500
        }).then(() => {
          this.router.navigate(["/home/welcome"])
        })
      })
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
