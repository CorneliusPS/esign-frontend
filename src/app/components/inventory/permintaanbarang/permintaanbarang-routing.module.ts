import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PermintaanbarangComponent } from './permintaanbarang.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: PermintaanbarangComponent }
	])],
	exports: [RouterModule]
})
export class PermintaanbarangRoutingModule { }
