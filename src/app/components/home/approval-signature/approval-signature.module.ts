import { DocumentService } from './../../../service/document.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
import { AutoCompleteModule } from 'primeng/autocomplete';
import { UserService } from 'src/app/service/user.service';
import { ApprovalSignatureRoutingModule } from './approval-signature-routing.module';
import { ApprovalSignatureComponent } from './approval-signature.component';
import { ApprovalService } from 'src/app/service/approval.service';
import { AngularSignaturePadModule } from '@almothafar/angular-signature-pad';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@NgModule({
  imports: [
    CommonModule,
    ApprovalSignatureRoutingModule,
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
    AutoCompleteModule,
    AngularSignaturePadModule,
    NgxExtendedPdfViewerModule,
  ],
  declarations: [ApprovalSignatureComponent],
  providers: [DocumentService, UserService, ApprovalService],
})
export class ApprovalSignatureModule {}
