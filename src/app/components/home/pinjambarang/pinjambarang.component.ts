import {Component, HostListener, OnInit} from '@angular/core';
import {MessageService, SelectItem} from 'primeng/api';
import { DataView } from 'primeng/dataview';
import {ViewportScroller} from "@angular/common";
import {IBarang} from "../../../interfaces/interfaces-barang/i-barang";
import {catchError, throwError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {IResponseList} from "../../../interfaces/i-response-list";
import {BarangService} from "../../../service/barang.service";
import {IError} from "../../../interfaces/i-error";
import {AuthService} from "../../../service/auth.service";
import {PinjambaranguserService} from "../../../service/pinjambaranguser.service";
import {IPeminjamanUsrReq} from "../../../interfaces/interface-peminjaman-user/i-peminjaman-usr-req";
import {FormBuilder, Validators} from "@angular/forms";
import Swal from "sweetalert2";

@Component({
    templateUrl: './pinjambarang.component.html',
    styleUrls: ['pinjambarnag.component.css'],
    providers: [MessageService]
})
export class PinjambarangComponent implements OnInit {

   barangDialog: boolean = false;

    submitted: boolean = false;

    sortOptions: SelectItem[] = [];

    barangs: IBarang[] = [];

    barang: IBarang = {};

    selectedBarangs: IBarang[] = [];

    postPinjamBarang: IPeminjamanUsrReq;

    sortOrder: number = 0;

    sortField: string = '';

    sourceCities: any[] = [];

    targetCities: any[] = [];

    orderCities: any[] = [];

    statuses: any[] = [];

    mobileSize: boolean = false;

    error: IError;

    constructor(private barangService: BarangService, private formBuilder : FormBuilder, private pinjambaranguserService : PinjambaranguserService, private messageService: MessageService, private authService: AuthService, private viewportScroller: ViewportScroller) {
      this.error = {
        status: false,
        message: '',
        timestamp: 0
      }
      this.postPinjamBarang = {

      }
    }

    ngOnInit() {
        this.getBarang()

        this.sourceCities = [
            { name: 'San Francisco', code: 'SF' },
            { name: 'London', code: 'LDN' },
            { name: 'Paris', code: 'PRS' },
            { name: 'Istanbul', code: 'IST' },
            { name: 'Berlin', code: 'BRL' },
            { name: 'Barcelona', code: 'BRC' },
            { name: 'Rome', code: 'RM' }];

        this.targetCities = [];

        this.orderCities = [
            { name: 'San Francisco', code: 'SF' },
            { name: 'London', code: 'LDN' },
            { name: 'Paris', code: 'PRS' },
            { name: 'Istanbul', code: 'IST' },
            { name: 'Berlin', code: 'BRL' },
            { name: 'Barcelona', code: 'BRC' },
            { name: 'Rome', code: 'RM' }];

        this.sortOptions = [
            { label: 'Stock High to Low', value: '!stokBarang' },
            { label: 'Stock Low to High', value: 'stokBarang' }
        ];

        this.statuses = [
          { label: 'INSTOCK', value: 'instock' },
          { label: 'LOWSTOCK', value: 'lowstock' },
          { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];

      this.onResize(); // Call initially to set mobileSize
      this.viewportScroller.scrollToPosition([0, 0]); // Scroll to top after rendering
    }

  getBarang() {
    this.barangService.getBarang().pipe(catchError((error: HttpErrorResponse) => {
      this.error = {
        status: true,
        message: error.error.message,
        timestamp: error.error.timestamp
      }
      if (error.status == 401) {
        this.authService.logout()
      }
      return throwError(() => new Error('Error Barang'))
    }))
      .subscribe((response: IResponseList) => {
        this.barangs = response.data
        console.log(this.barangs)
      })
  }

    editBarang(barang: IBarang) {
      console.log(this.barang.statusBarang)
      if (barang.statusBarang === 'OUTOFSTOCK') {

      } else {
        this.barang = { ...barang };
        this.barangDialog = true;
      }
    }

  borrowBarang() {
    if (this.barang.idBarang) {
      const requestBody = {
        tanggalPeminjaman: this.postPinjamBarang.tanggalPeminjaman,
        tanggalPengambilan: this.postPinjamBarang.tanggalPengambilan,
        jumlahPeminjaman: this.postPinjamBarang.jumlahPeminjaman,
        idBarang: this.barang.idBarang
      };

      this.pinjambaranguserService.usrReqPinjamBarang(requestBody).pipe(
        catchError((error: HttpErrorResponse) => {
          this.error = {
            status: true,
            message: error.error.message,
            timestamp: error.error.timestamp
          }
          console.log(error.status)
          if (error.status == 401) {
            this.authService.logout()
          } else if (error.status == 406) {
            this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Stock barang tidak mencukupi', life: 3000 });
          }
          this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Peminjaman barang gagal diajukan', life: 3000 });
          return throwError(() => new Error(error.message))
        })
      ).subscribe(response => {
        this.barangDialog = false;
        Swal.fire({
          icon: "success",
          title: "Peminjaman barang berhasil",
          showConfirmButton: true,
          timer: 3000
        })
        this.getBarang()
      });
    }
  }


    hideDialog() {
      this.barangDialog = false;
      this.submitted = false;
      this.barang = {
        kodeBarang:"",
        namaBarang:"",
        hargaBarang:0,
        stokBarang:0,
        statusBarang:"",
        deskripsiBarang:"",
        kategoriBarang: undefined
      }
      this.postPinjamBarang = {

      }
    }

    onSortChange(event: any) {
        const value = event.value;

        if (value.indexOf('!') === 0) {
            this.sortOrder = -1;
            this.sortField = value.substring(1, value.length);
        } else {
            this.sortOrder = 1;
            this.sortField = value;
        }
    }

  onFilter(dv: DataView, event: Event) {
        dv.filter((event.target as HTMLInputElement).value);
    }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.mobileSize = window.innerWidth <= 768; // Update mobileSize based on breakpoint
  }

}
