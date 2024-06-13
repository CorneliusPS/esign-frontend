import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RequestSignatureComponent } from './request-signature.component';


@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: RequestSignatureComponent }
	])],
	exports: [RouterModule]
})
export class RequestSignatureRoutingModule { }
