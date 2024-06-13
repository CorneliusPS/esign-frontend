import { Component, OnInit } from '@angular/core';
import {MessageService, SelectItem} from 'primeng/api';
import { DataView } from 'primeng/dataview';
import {Table} from "primeng/table";
import {KategoriService} from "../../../service/kategori.service";
import {Kategori} from "../../../api/kategori";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {catchError, throwError} from "rxjs";
import {ISignInResponse} from "../../../interfaces/interfaces-auth/i-signin-response";
import {ISignInError} from "../../../interfaces/interfaces-auth/i-signin-error";
import {IKategori} from "../../../interfaces/interfaces-kategori/i-kategori";
import {IError} from "../../../interfaces/i-error";
import {IResponseList} from "../../../interfaces/i-response-list";
import {FormBuilder, Validators} from "@angular/forms";
import {NavigationEnd, Router} from "@angular/router";
import {AuthService} from "../../../service/auth.service";

@Component({
    selector: 'app-kategori',
    templateUrl: './kategoribarang.component.html',
    providers: [MessageService]
})
export class KategoribarangComponent implements OnInit {

  kategoriDialog: boolean = false;

  deleteKategoriDialog: boolean = false;

  kategoris: IKategori[] = [];

  kategori: IKategori = {};

  selectedKategoris: IKategori[] = [];

  submitted: boolean = false;

  cols: any[] = [];

  statuses: any[] = [];

  rowsPerPageOptions = [5, 10, 20];

  error: IError;

  kategoriForm = this.formBuilder.group({
    kodeKategori: ["", Validators.required],
    namaKategori: ["", Validators.required],
    deskripsiKategori: [""]
  });
  constructor(private kategoriService: KategoriService, private authService: AuthService, private formBuilder : FormBuilder, private messageService: MessageService, private router: Router, private http: HttpClient) {
    this.error = {
      status: false,
      message: '',
      timestamp: 0
    }
  }

  ngOnInit() {
    // this.kategoriService.getKategoriz().then(data => this.kategoris = data);
    this.getKategori()

    this.cols = [
      { field: 'nomorKategori', header: 'nomorKategori' },
      { field: 'kodeKategori', header: 'Kode' },
      { field: 'namaKategori', header: 'Kategori' },
      { field: 'deskripsiKategori', header: 'Deskripsi' },
      { field: 'createdBy', header: 'Created By' },
      { field: 'createdDate', header: 'Created Date' }
    ];
  }
  getKategori() {
    this.kategoriService.getKategori().pipe(catchError((error: HttpErrorResponse) => {
      this.error = {
        status: true,
        message: error.error.message,
        timestamp: error.error.timestamp
      }
      console.log(error.status)
      if (error.status == 401) {
        this.authService.logout()
      }
      return throwError(() => new Error('Error kategori'))
    }))
      .subscribe((response: IResponseList) => {
        this.kategoris = response.data
        console.log(this.kategoris)
      })
  }

  openNew() {
    this.kategori = {};
    this.submitted = false;
    this.kategoriDialog = true;
  }

  editKategori(kategori: IKategori) {
    this.kategori = { ...kategori };
    this.kategoriDialog = true;
  }

  deleteKategori(kategori: IKategori) {
    this.deleteKategoriDialog = true;
    this.kategori = { ...kategori };
  }

  confirmDeleteSelected() {
    this.deleteKategoriDialog = false;
    this.kategoris = this.kategoris.filter(val => !this.selectedKategoris.includes(val));
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Kategori Deleted', life: 3000 });
    this.selectedKategoris = [];
  }

  confirmDelete() {
    this.deleteKategoriDialog = false;
    this.kategoris = this.kategoris.filter(val => val.idKategori !== this.kategori.idKategori);
    console.log(this.kategori.idKategori)
    this.kategoriService.deleteKategori(this.kategori.idKategori).pipe(catchError((error: HttpErrorResponse) => {
      this.error = {
        status: true,
        message: error.error.message,
        timestamp: error.error.timestamp
      }
      console.log(error.status)
      if (error.status == 401) {
        this.authService.logout()
      }
      this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Kode Kategori Does Not Exist', life: 3000 });
      return throwError(() => new Error('Error kategori'))
    }))
      .subscribe(response => {
        console.log(response)

        this.kategoriDialog = false;
        this.getKategori()
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Kategori Deleted', life: 3000 });
      })
  }

  hideDialog() {
    this.kategoriDialog = false;
    this.submitted = false;
  }

  saveKategori() {
    this.submitted = true;

    console.log(this.kategoriForm.value)
    console.log(this.kategori.kodeKategori)
    console.log(this.kategori.namaKategori)
    console.log(this.kategori.deskripsiKategori)



    if (this.kategori.namaKategori?.trim()) {
      if (this.kategori.idKategori) {
        // @ts-ignore
        // this.product.inventoryStatus = this.product.inventoryStatus.value ? this.product.inventoryStatus.value : this.product.inventoryStatus;
        // this.products[this.findIndexById(this.product.id)] = this.product;
        // this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product Updated', life: 3000 });
        this.kategoriService.updateKategori(this.kategoriForm.value, this.kategori.idKategori).pipe(catchError((error: HttpErrorResponse) => {
          this.error = {
            status: true,
            message: error.error.message,
            timestamp: error.error.timestamp
          }
          console.log(error.status)
          if (error.status == 401) {
            this.authService.logout()
          }
          this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Kode Kategori Already Exist', life: 3000 });
          return throwError(() => new Error('Error kategori'))
        }))
          .subscribe(response => {
            console.log(response)
            this.kategoriForm.reset();
            this.kategoriDialog = false;
            this.getKategori()
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Kategori Updated', life: 3000 });
          })
        console.log("Update")
      } else {
        this.kategoriService.saveKategori(this.kategoriForm.value).pipe(catchError((error: HttpErrorResponse) => {
          this.error = {
            status: true,
            message: error.error.message,
            timestamp: error.error.timestamp
          }
          console.log(error.status)
          if (error.status == 401) {
            this.authService.logout()
          }
          this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Kode Kategori Already Exist', life: 3000 });
          return throwError(() => new Error('Error kategori'))
        }))
          .subscribe(response => {
            console.log(response)
            this.kategoriForm.reset();
            this.kategoriDialog = false;
            this.getKategori()
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Kategori Created', life: 3000 });
          })
      }
    }
  }

  findIndexById(idKategori: string): number {
    let index = -1;
    for (let i = 0; i < this.kategoris.length; i++) {
      if (this.kategoris[i].idKategori === idKategori) {
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
