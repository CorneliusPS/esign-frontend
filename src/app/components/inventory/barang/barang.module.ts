import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BarangRoutingModule } from './barang-routing.module';
import { BarangComponent } from './barang.component';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import {ProductService} from "../../../service/product.service";
import {BarangService} from "../../../service/barang.service";
import {ImageModule} from "primeng/image";
import {KategoriService} from "../../../service/kategori.service";
import {ProgressSpinnerModule} from "primeng/progressspinner";

@NgModule({
    imports: [
        CommonModule,
        BarangRoutingModule,
        TableModule,
        FileUploadModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        InputTextareaModule,
        DropdownModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        ImageModule,
        ReactiveFormsModule,
        ProgressSpinnerModule
    ],
	declarations: [BarangComponent],
  providers: [ProductService, BarangService, KategoriService]
})
export class BarangModule { }
