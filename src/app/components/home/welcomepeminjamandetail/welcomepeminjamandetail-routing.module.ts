import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WelcomepeminjamandetailComponent } from './welcomepeminjamandetail.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: WelcomepeminjamandetailComponent }
	])],
	exports: [RouterModule]
})
export class WelcomepeminjamandetailRoutingModule { }
