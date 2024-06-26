import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddSignatureRoutingModule } from './add-signature-routing.module';
import { AddSignatureComponent } from './add-signature.component';
import { ToastModule } from 'primeng/toast';
import { AuthService } from 'src/app/service/auth.service';
import { ApprovalService } from 'src/app/service/approval.service';
import { AngularSignaturePadModule } from '@almothafar/angular-signature-pad';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  declarations: [AddSignatureComponent],
  imports: [
    CommonModule,
    AddSignatureRoutingModule,
    ToastModule,
    AngularSignaturePadModule,
    ButtonModule,
    RippleModule,
    NgxExtendedPdfViewerModule,
    AngularSignaturePadModule,
    FormsModule, // Tambahkan FormsModule ke dalam imports array
    InputTextModule,
    DialogModule,
  ],
  providers: [AuthService, ApprovalService],
})
export class AddSignatureModule {}
