import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { WelcomepermintaandetailComponent } from './welcomepermintaandetail.component';
import { WelcomepermintaandetailRoutingModule } from './welcomepermintaandetail-routing.module';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import {DialogModule} from "primeng/dialog";
import {FileUploadModule} from "primeng/fileupload";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextareaModule} from "primeng/inputtextarea";
import {RadioButtonModule} from "primeng/radiobutton";
import {RippleModule} from "primeng/ripple";
import {TableModule} from "primeng/table";
import {ToastModule} from "primeng/toast";
import {ToolbarModule} from "primeng/toolbar";
import {ProductService} from "../../../service/product.service";
import {KategoriService} from "../../../service/kategori.service";
import {Router} from "@angular/router";
import {PeminjamanbarangService} from "../../../service/peminjamanbarang.service";
import {ImageModule} from "primeng/image";
import {BarangService} from "../../../service/barang.service";
import {PinjambaranguserService} from "../../../service/pinjambaranguser.service";
import {CalendarModule} from "primeng/calendar";
import {MintabaranguserService} from "../../../service/mintabaranguser.service";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ConfirmationService} from "primeng/api";

@NgModule({
  imports: [
    CommonModule,
    WelcomepermintaandetailRoutingModule,
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
    ReactiveFormsModule,
    ImageModule,
    CalendarModule,
    ConfirmDialogModule
  ],
	declarations: [WelcomepermintaandetailComponent],
  providers: [KategoriService, PinjambaranguserService, BarangService, MintabaranguserService, ConfirmationService]
})
export class WelcomepermintaandetailModule { }
