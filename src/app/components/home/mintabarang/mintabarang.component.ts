import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, finalize } from "rxjs/operators";
import { throwError } from "rxjs";
import Swal from 'sweetalert2';
import {IPermintaanUsrReq} from "../../../interfaces/interface-permintaan-user/i-permintaan-usr-req";
import {IError} from "../../../interfaces/i-error";
import {MintabaranguserService} from "../../../service/mintabaranguser.service";
import {AuthService} from "../../../service/auth.service";
import {Router} from "@angular/router";

@Component({
  templateUrl: './mintabarang.component.html',
  styleUrls: ['mintabarang.css'],
  providers: [MessageService]
})
export class MintabarangComponent implements OnInit {

  submitted: boolean = false;
  permintaanBarangDialog: boolean = false;
  postPermintaanBarang?: IPermintaanUsrReq;
  selectedFileName = ''; // Variable to store filename
  error: IError;
  progressSpinnerVisible: boolean = false;

  constructor(
    private mintabaranguserService: MintabaranguserService,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private http: HttpClient
  ) {
    this.error = {
      status: false,
      message: '',
      timestamp: 0
    }
    this.postPermintaanBarang = {}
  }

  ngOnInit(): void { }

  submitPermintaan() {
    this.submitted = true;
    this.progressSpinnerVisible = true;

    const formData = new FormData();
    if (this.postPermintaanBarang?.filePermintaan) {
      formData.append('filePermintaan', this.postPermintaanBarang.filePermintaan);
    }
    if (this.postPermintaanBarang?.tanggalPermintaan) {
      // @ts-ignore
      this.postPermintaanBarang.tanggalPermintaan = new Date(this.postPermintaanBarang.tanggalPermintaan).toISOString().split('T')[0];
    }

    this.mintabaranguserService.submitPermintaanBarang(this.postPermintaanBarang, formData)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.error = {
            status: true,
            message: error.error.message,
            timestamp: error.error.timestamp
          }
          if (error.status == 401) {
            this.authService.logout()
          } else if (error.status == 400) {
            this.messageService.add({
              severity: 'error',
              summary: 'Failed',
              detail: 'Semua field harus diisi',
              life: 3000
            });
          }

          this.messageService.add({
            severity: 'error',
            summary: 'Failed',
            detail: 'Permintaan Barang tidak dapat disimpan',
            life: 3000
          });

          return throwError(() => new Error('Error Permintaan Barang'))
        }),
        finalize(() => {
          this.progressSpinnerVisible = false;
        })
      )
      .subscribe(response => {
        this.permintaanBarangDialog = false;
        Swal.fire({
          icon: "success",
          title: "Permintaan barang berhasil dikirimkan",
          showConfirmButton: true,
          timer: 1500
        }).then(() => {
          this.router.navigate(["/home/welcome"])
          this.postPermintaanBarang = {}
        })
      })
  }

  onUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      this.postPermintaanBarang!.filePermintaan = file;
      console.log(this.postPermintaanBarang!.filePermintaan)
    }
  }
}
