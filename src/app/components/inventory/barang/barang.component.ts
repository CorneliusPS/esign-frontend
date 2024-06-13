import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import {IBarang} from "../../../interfaces/interfaces-barang/i-barang";
import {BarangService} from "../../../service/barang.service";
import {FormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {IResponseList} from "../../../interfaces/i-response-list";
import {IError} from "../../../interfaces/i-error";
import {AuthService} from "../../../service/auth.service";
import {KategoriService} from "../../../service/kategori.service";
import {IBarangPost} from "../../../interfaces/interfaces-barang/i-barang-post";
import {IKategori} from "../../../interfaces/interfaces-kategori/i-kategori";
import {finalize} from "rxjs/operators";

@Component({
    templateUrl: './barang.component.html',
    styleUrls: ['barang.component.css'],
  providers: [MessageService]
})
export class BarangComponent implements OnInit {

  submitted: boolean = false;

  cols: any[] = [];

  statuses: any[] = [];

  kategoriesChoises: any[] = [];

  barangDialog: boolean = false;

  deleteBarangDialog: boolean = false;

  barangs: IBarang[] = [];

  barang: IBarang = {};

  postBarang: IBarangPost;

  dropdownKategori: any[] = []

  statusDropdown: any[] = []

  selectedBarangs: IBarang[] = [];

  kategoris: IKategori[] = [];

  rowsPerPageOptions = [5, 10, 20];

  // postBarang = { imageBarang: '' }; // Initialize imageBarang
  selectedFileName = ''; // Variable to store filename

  progressSpinnerVisible: boolean = false;

  error: IError;

  constructor(private kategoriService: KategoriService, private authService: AuthService, private barangService: BarangService, private formBuilder : FormBuilder, private messageService: MessageService, private router: Router, private http: HttpClient) {
    this.error = {
      status: false,
      message: '',
      timestamp: 0
    }
    this.postBarang = {

    }
  }

  ngOnInit() {
    this.getBarang()

    this.getKategori()

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

    this.statuses = [
      { label: 'INSTOCK', value: 'instock' },
      { label: 'OUTOFSTOCK', value: 'outofstock' }
    ];
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
      })
  }

  getKategori() {
    this.kategoriService.getKategori().pipe(catchError((error: HttpErrorResponse) => {
      this.error = {
        status: true,
        message: error.error.message,
        timestamp: error.error.timestamp
      }
      if (error.status == 401) {
        this.authService.logout()
      }
      return throwError(() => new Error('Error kategori'))
    }))
      .subscribe((response: IResponseList) => {
        this.kategoris = response.data
      })
  }

  openNew() {
    this.barang = {};
    this.submitted = false;
    this.barangDialog = true;

    this.dropdownKategori = this.kategoris.map(kategori => ({
      label: kategori.namaKategori?.toUpperCase(),
      value: { namaKategori: kategori.namaKategori?.toUpperCase(), idKategori: kategori.idKategori }
    }));

    this.statusDropdown = this.statuses.map(status => ({
      label: status.label?.toUpperCase(),
      value: status.value?.toLowerCase()
    }))
  }

  deleteSelectedBarangs() {
    this.deleteBarangDialog = true;
  }

  editBarang(iBarangPost: IBarangPost) {
    // Find the selected category based on the idKategori of the edited barang
    const selectedKategori = iBarangPost.kategoriBarang
      ? this.kategoris.find(kategori => kategori.idKategori === iBarangPost.kategoriBarang!.idKategori)
      : undefined;

    // Create dropdown options for kategori
    this.dropdownKategori = this.kategoris.map(kategori => ({
      label: kategori.namaKategori ? kategori.namaKategori.toUpperCase() : '', // Ensure namaKategori is not undefined
      value: { namaKategori: kategori.namaKategori ? kategori.namaKategori.toLowerCase() : '', idKategori: kategori.idKategori || '' } // Ensure idKategori is not undefined
    }));

    // Create dropdown options for status
    this.statusDropdown = this.statuses.map(status => ({
      label: status.label ? status.label.toUpperCase() : '', // Ensure label is not undefined
      value: status.value ? status.value.toLowerCase() : '' // Ensure value is not undefined
    }));

    // Assign the selected category to postBarang.kategoriBarang
    this.postBarang = {
      ...iBarangPost,
      kategoriBarang: selectedKategori ? {
        namaKategori: selectedKategori.namaKategori || '',
        idKategori: selectedKategori.idKategori || ''
      } : undefined
    };

    this.barangDialog = true;
  }


  deleteBarang(barang: IBarang) {
    this.deleteBarangDialog = true;
    this.barang = { ...barang };
  }

  confirmDeleteSelected() {
    this.deleteBarangDialog = false;
    this.barangs = this.barangs.filter(val => !this.selectedBarangs.includes(val));
    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Barangs Deleted', life: 3000 });
    this.selectedBarangs = [];
  }

  confirmDelete() {
    this.deleteBarangDialog = false;
    this.barangService.deleteBarang(this.barang.imageId).pipe(catchError((error: HttpErrorResponse) => {
      this.error = {
        status: true,
        message: error.error.message,
        timestamp: error.error.timestamp
      }
      if (error.status == 401) {
        this.authService.logout()
      }
      this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Kode Barang Does Not Exist', life: 3000 });
      return throwError(() => new Error('Error barang'))
    }))
      .subscribe(response => {
        this.getBarang()
        this.barangDialog = false;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Barang Deleted', life: 3000 });
      })
  }

  hideDialog() {
    this.barangDialog = false;
    this.submitted = false;
    this.postBarang = {

    }
    this.selectedFileName = ""
  }

  saveBarang() {
    this.progressSpinnerVisible = true;
    this.submitted = true;

    if (this.postBarang.namaBarang?.trim()) {
      if (this.postBarang.idBarang) {
        // @ts-ignore
        const formData = new FormData();
        if (this.postBarang.imageBarang) {
          formData.append('imageBarang', this.postBarang.imageBarang);
        }
        let numberIdBarang: number = Number(this.postBarang.idBarang);
        this.barangService.updateBarang(this.postBarang, formData, numberIdBarang).pipe(catchError((error: HttpErrorResponse) => {
          this.error = {
            status: true,
            message: error.error.message,
            timestamp: error.error.timestamp
          }
          if (error.status == 401) {
            this.authService.logout()
          }
          this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Barang tidak dapat disimpan', life: 3000 });
          return throwError(() => new Error(error.message))
        }),
          finalize(() => {
            this.progressSpinnerVisible = false;
          })
        )
          .subscribe(response => {
            this.barangDialog = false;
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Barang Created', life: 3000 });
            this.getBarang()
          })
      } else {
        const formData = new FormData();
        if (this.postBarang.imageBarang) {
          formData.append('imageBarang', this.postBarang.imageBarang);
        }
        this.barangService.saveBarang(this.postBarang, formData).pipe(catchError((error: HttpErrorResponse) => {
          this.error = {
            status: true,
            message: error.error.message,
            timestamp: error.error.timestamp
          }
          if (error.status == 401) {
            this.authService.logout()
          } else if (error.status == 400) {
            this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Semua field harus diisi', life: 3000 });
          }
          return throwError(() => new Error('Error kategori'))
          this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Barang tidak dapat disimpan', life: 3000 });
        }),
          finalize(() => {
            this.progressSpinnerVisible = false;
          })
        )
          .subscribe(response => {
            this.barangDialog = false;
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Barang Created', life: 3000 });
            this.getBarang()
          })

      }
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.barangs.length; i++) {
      if (this.barangs[i].idBarang === id) {
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

  onUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      this.selectedFileName = target.files[0].name;

      // ... code to handle image upload and update postBarang.imageBarang ...
    }
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      this.postBarang.imageBarang = file;
    }
  }


  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
