import { Component, OnInit, OnDestroy } from '@angular/core';
import {MenuItem, MessageService} from 'primeng/api';
// import { Product } from '../../api/product';
// import { ProductService } from '../../service/product.service';
import {catchError, Subscription, throwError} from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {IResponseList} from "../../interfaces/i-response-list";
import {KategoriService} from "../../service/kategori.service";
import {AuthService} from "../../service/auth.service";
import {BarangService} from "../../service/barang.service";
import {FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";
import {DashboardService} from "../../service/dashboard.service";
import {IError} from "../../interfaces/i-error";
import {IDashboard} from "../../interfaces/interface-dashboard/i-dashboard";
import {IBarang} from "../../interfaces/interfaces-barang/i-barang";

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {

  countBarangs: IDashboard | undefined;

  countPeminjamanBarangs: IDashboard | undefined;

  countPermintaanBarangs: IDashboard | undefined;

  countKategoriBarangs: IDashboard | undefined;

  error: IError;

  constructor(private dashboardService: DashboardService, private authService: AuthService, private messageService: MessageService, private router: Router, private http: HttpClient) {
    this.error = {
      status: false,
      message: '',
      timestamp: 0
    }
  }

  subscription!: Subscription;
    ngOnDestroy(): void {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }
    ngOnInit(): void {
      this.getCountBarang()
      this.getCountPeminjamanBarang()
      this.getCountPermintaanBarang()
      this.getCountKategoriBarang()
    }

  getCountBarang() {
    this.dashboardService.getCountBarang().pipe(catchError((error: HttpErrorResponse) => {
      this.error = {
        status: true,
        message: error.error.message,
        timestamp: error.error.timestamp
      }
      if (error.status == 401) {
        this.authService.logout()
        this.router.navigate(['/notfound'])
      }
      return throwError(() => new Error('Error Barang'))
    }))
      .subscribe((response: IDashboard) => {
        console.log(response)
        this.countBarangs = response
      })
  }
  getCountPeminjamanBarang() {
    this.dashboardService.getCountPeminjamanBarang().pipe(catchError((error: HttpErrorResponse) => {
      this.error = {
        status: true,
        message: error.error.message,
        timestamp: error.error.timestamp
      }
      if (error.status == 401) {
        this.authService.logout()
        this.router.navigate(['/notfound'])
      }
      return throwError(() => new Error('Error Peminjaman Barang'))
    }))
      .subscribe((response: IDashboard) => {
        console.log(response)
        this.countPeminjamanBarangs = response
      })
  }

  getCountPermintaanBarang() {
    this.dashboardService.getCountPermintaanBarang().pipe(catchError((error: HttpErrorResponse) => {
      this.error = {
        status: true,
        message: error.error.message,
        timestamp: error.error.timestamp
      }
      if (error.status == 401) {
        this.authService.logout()
        this.router.navigate(['/notfound'])
      }
      return throwError(() => new Error('Error Permintaan Barang'))
    }))
      .subscribe((response: IDashboard) => {
        console.log(response)
        this.countPermintaanBarangs = response
      })
  }

  getCountKategoriBarang() {
    this.dashboardService.getCountKategoriBarang().pipe(catchError((error: HttpErrorResponse) => {
      this.error = {
        status: true,
        message: error.error.message,
        timestamp: error.error.timestamp
      }
      if (error.status == 401) {
        this.authService.logout()
        this.router.navigate(['/notfound'])
      }
      return throwError(() => new Error('Error Kategori Barang'))
    }))
      .subscribe((response: IDashboard) => {
        console.log(response)
        this.countKategoriBarangs = response
      })
  }


}
