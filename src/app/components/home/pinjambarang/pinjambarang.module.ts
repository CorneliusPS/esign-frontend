import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { PinjambarangComponent } from './pinjambarang.component';
import { PinjambarangRoutingModule } from './pinjambarang-routing.module';
import { DataViewModule } from 'primeng/dataview';
import { PickListModule } from 'primeng/picklist';
import { OrderListModule } from 'primeng/orderlist';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import {KategoriService} from "../../../service/kategori.service";
import {PermintaanbarangService} from "../../../service/permintaanbarang.service";
import {ProductService} from "../../../service/product.service";
import {WelcomeRoutingModule} from "../welcome/welcome-routing.module";
import {TableModule} from "primeng/table";
import {FileUploadModule} from "primeng/fileupload";
import {RippleModule} from "primeng/ripple";
import {ToastModule} from "primeng/toast";
import {ToolbarModule} from "primeng/toolbar";
import {InputTextareaModule} from "primeng/inputtextarea";
import {RadioButtonModule} from "primeng/radiobutton";
import {InputNumberModule} from "primeng/inputnumber";
import {DialogModule} from "primeng/dialog";
import {ImageModule} from "primeng/image";
import {WelcomeComponent} from "../welcome/welcome.component";
import {PeminjamanbarangService} from "../../../service/peminjamanbarang.service";
import {CalendarModule} from "primeng/calendar";
import {BarangService} from "../../../service/barang.service";
import {AuthService} from "../../../service/auth.service";
import {PinjambaranguserService} from "../../../service/pinjambaranguser.service";
import {MessageService} from "primeng/api";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PinjambarangRoutingModule,
    DataViewModule,
    PickListModule,
    OrderListModule,
    InputTextModule,
    DropdownModule,
    RatingModule,
    ButtonModule,
    InputNumberModule,
    RadioButtonModule,
    DialogModule,
    RippleModule,
    CalendarModule,
    ImageModule,
    ToastModule
  ],
	declarations: [PinjambarangComponent],
  providers: [ProductService, BarangService, PinjambaranguserService, AuthService]
})
export class PinjambarangModule { }
