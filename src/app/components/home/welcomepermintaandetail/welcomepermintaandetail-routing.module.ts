import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WelcomepermintaandetailComponent } from './welcomepermintaandetail.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: WelcomepermintaandetailComponent }
	])],
	exports: [RouterModule]
})
export class WelcomepermintaandetailRoutingModule { }
