import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApprovalSignatureComponent } from './approval-signature.component';

const routes: Routes = [];

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: ApprovalSignatureComponent },
    ]),
  ],
  exports: [RouterModule],
})
export class ApprovalSignatureRoutingModule {}
