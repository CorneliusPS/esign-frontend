import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentSignedComponent } from './document-signed.component';

const routes: Routes = [];

@NgModule({
  imports: [
    RouterModule.forChild([{ path: '', component: DocumentSignedComponent }]),
  ],
  exports: [RouterModule],
})
export class DocumentSignedRoutingModule {}
