import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PeminjamanbarangComponent } from './peminjamanbarang.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: PeminjamanbarangComponent }
	])],
	exports: [RouterModule]
})
export class PeminjamanbarangRoutingModule { }
