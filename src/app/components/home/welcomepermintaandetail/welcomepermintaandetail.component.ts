import { Component, OnInit } from '@angular/core';
import {ConfirmationService, MessageService, SelectItem} from 'primeng/api';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, throwError} from "rxjs";
import {IError} from "../../../interfaces/i-error";
import {IResponseList} from "../../../interfaces/i-response-list";
import {AuthService} from "../../../service/auth.service";
import {BarangService} from "../../../service/barang.service";
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {IBarang} from "../../../interfaces/interfaces-barang/i-barang";
import {IPermintaanUsrGet} from "../../../interfaces/interface-permintaan-user/i-permintaan-usr-get";
import {MintabaranguserService} from "../../../service/mintabaranguser.service";
import Swal from "sweetalert2";

@Component({
    templateUrl: './welcomepermintaandetail.component.html',
    styleUrls: ['welcomepermintaandetail.css'],
    providers: [MessageService]
})
export class WelcomepermintaandetailComponent implements OnInit {

  cols: any[] = [];

  permintaanBarang?: IPermintaanUsrGet;

  selectedBarangs: IBarang[] = [];

  permintaanBarangId: string = '';

  deletePermintaanDialog: boolean = false;

  submitted: boolean = false;

  error: IError;

  constructor(private mintabaranguserService: MintabaranguserService, private confirmationService: ConfirmationService, private authService: AuthService, private barangService: BarangService, private formBuilder : FormBuilder, private messageService: MessageService, private router: Router, private http: HttpClient, private activatedRoute: ActivatedRoute) {
    this.error = {
      status: false,
      message: '',
      timestamp: 0
    }
  }

  ngOnInit(): void {
    this.permintaanBarangId = this.activatedRoute.snapshot.paramMap.get('id')!;
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
    this.mintabaranguserService.getPermintaanBarangDetail(Number(this.permintaanBarangId)).pipe(catchError((error: HttpErrorResponse) => {
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
        this.permintaanBarang = response.data
      })
  }

  confirm() {
    this.deletePermintaanDialog = true;
  }

  hideDialog() {
    this.deletePermintaanDialog = false;
    this.submitted = false;
  }

  confirmDelete(idPermintaanBarang: number) {
    this.deletePermintaanDialog = false;
    this.mintabaranguserService.deletePermintaanBarang(idPermintaanBarang).pipe(catchError((error: HttpErrorResponse) => {
      this.error = {
        status: true,
        message: error.error.message,
        timestamp: error.error.timestamp
      }
      if (error.status == 401) {
        this.authService.logout()
      }
      this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Permintaan Barang Does Not Exist', life: 3000 });
      return throwError(() => new Error('Error permintaan barang'))
    }))
      .subscribe(response => {
        this.deletePermintaanDialog = false;
        Swal.fire({
          icon: "success",
          title: "Permintaan barang berhasil dibatalkan",
          showConfirmButton: true,
          // timer: 1500
        }).then(() => {
          this.router.navigate(["/home/welcome"])
        })
      })
  }

  protected readonly navigator = navigator;
}
