import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PinjambarangComponent } from './pinjambarang.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: PinjambarangComponent }
	])],
	exports: [RouterModule]
})
export class PinjambarangRoutingModule { }
