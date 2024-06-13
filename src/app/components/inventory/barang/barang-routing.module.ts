import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BarangComponent } from './barang.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: BarangComponent }
	])],
	exports: [RouterModule]
})
export class BarangRoutingModule { }
